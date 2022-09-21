import type { Class, NormalClass } from '../../src/types/diTypes';

import { Message } from '../utils/message';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { DependenciesGraph } from './dependenciesGraph';
import { DependenciesSearcher } from './dependenciesSearcher';
import { AUTO, messageNewLineSign } from '../../src/constants/diConstants';

export class DependenciesCreator {
    private static instance: DependenciesCreator;

    private dependenciesSearcher = DependenciesSearcher.getInstance();

    private dependenciesGraph = new DependenciesGraph();
    private creatingInstanceClassQueue: NormalClass[] = [];

    private isInjecting = false;

    createDependency<T>(usingClass: NormalClass<T>, usingArgs?: any[]): T {
        let isRootInjection = false;
        if (!this.isInjecting) {
            this.isInjecting = true;
            isRootInjection = true;
        }

        const instance = this.createInstance(usingClass, usingArgs);

        if (isRootInjection) DependenciesCreator.instance = null;

        return instance;
    }

    getCreatingInstanceClass(): Class {
        if (this.creatingInstanceClassQueue.length === 0) return undefined;
        return this.creatingInstanceClassQueue[this.creatingInstanceClassQueue.length - 1];
    }

    // 递归创建依赖实例，以及依赖构造方法中可注入的参数项的实例
    private createInstance<T>(usingClass: NormalClass<T>, usingArgs?: any[]): T {
        this.checkCircularDependencies(usingClass);

        this.creatingInstanceClassQueue.push(usingClass);

        // 为构造方法参数注入实例
        const constructorArgs: Function[] = Reflect.getMetadata('design:paramtypes', usingClass);
        if (constructorArgs) {
            this.handleConstructorArgs(usingArgs, constructorArgs, usingClass);
        }

        // 创建实例
        try {
            let instance: T;
            if (usingArgs.length > 0) {
                instance = new usingClass(...usingArgs);
            } else {
                instance = new usingClass();
            }

            this.creatingInstanceClassQueue.pop();

            return instance;
        } catch (error: any) {
            Message.throwError(
                '39001',
                `依赖注入容器实例化类 "${usingClass.name}" 出错！${messageNewLineSign}${error?.stack || error}`
            );
        }

        return undefined;
    }

    // 检测循环依赖
    private checkCircularDependencies(usingClass: NormalClass): void {
        let outerClass: Class;
        if (this.creatingInstanceClassQueue.length > 0)
            outerClass = this.creatingInstanceClassQueue[this.creatingInstanceClassQueue.length - 1];

        const circularDependencyClasses = this.dependenciesGraph.addNodeAndCheckRing(usingClass, outerClass);
        if (circularDependencyClasses) {
            const circularDependencyClassNames = circularDependencyClasses.map((cdc) => cdc.name).join(' -> ');
            Message.throwError('39002', `检测到循环依赖：${circularDependencyClassNames}`);
        }
    }

    private handleConstructorArgs(usingArgs: any[], constructorArgs: any[], usingClass: NormalClass): void {
        if (usingArgs.length > constructorArgs.length) {
            Message.warn('20001', `为 "${usingClass.name}" 的构造方法配置的参数过多！`);
        } else if (usingArgs.length < constructorArgs.length) {
            const padLength = constructorArgs.length - usingArgs.length;
            for (let i = 0; i < padLength; i++) {
                usingArgs.push(AUTO);
            }
        }

        const dependenciesCollector = DependenciesClassCollector.getInstance();

        for (let i = 0; i < usingArgs.length; i++) {
            if (usingArgs[i] === AUTO) {
                const isInjectable = dependenciesCollector.contains(constructorArgs[i]);
                if (isInjectable) {
                    usingArgs[i] = this.dependenciesSearcher.searchDependency(constructorArgs[i]);
                } else {
                    usingArgs[i] = undefined;
                }
            }
        }
    }

    static getInstance(): DependenciesCreator {
        if (!DependenciesCreator.instance) {
            DependenciesCreator.instance = new DependenciesCreator();
        }
        return DependenciesCreator.instance;
    }
}
