import type { Class, NormalClass, ObjectType } from '../types/diTypes';

import { Message } from '../utils/message';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { DependenciesGraph } from './dependenciesGraph';
import { DependenciesSearcher } from './dependenciesSearcher';
import { AUTO, messageNewLineSign } from '../constants/diConstants';
import { InjectMembersHandler } from './injectMembersHandler';

export class DependenciesCreator {
    private static _instance: DependenciesCreator;

    private dependenciesSearcher = DependenciesSearcher.instance;

    private dependenciesGraph = new DependenciesGraph();
    private creatingInstanceClassQueue: NormalClass[] = [];

    private isInjecting = false;

    /** 创建依赖、控制当前实例，如果当前依赖树创建完毕，则销毁本实例 */
    createDependency<T>(usingClass: NormalClass<T>, usingArgs?: unknown[]): T {
        let isRootInjection = false;
        if (!this.isInjecting) {
            this.isInjecting = true;
            isRootInjection = true;
        }

        const instance = this.createInstance(usingClass, usingArgs);

        if (isRootInjection) DependenciesCreator._instance = null;

        return instance;
    }

    /** 获取正在创建依赖的实例所属的类 */
    getCreatingInstanceClass(): Class {
        if (this.creatingInstanceClassQueue.length === 0) return undefined;
        return this.creatingInstanceClassQueue[this.creatingInstanceClassQueue.length - 1];
    }

    /** 递归创建依赖实例，以及依赖构造方法中可注入的参数项的实例 */
    private createInstance<T>(usingClass: NormalClass<T>, usingArgs?: unknown[]): T {
        this.checkCircularDependencies(usingClass);

        this.creatingInstanceClassQueue.push(usingClass);

        // 为构造方法参数注入实例
        const constructorArgs: Function[] = Reflect.getMetadata?.('design:paramtypes', usingClass);
        if (constructorArgs) {
            this.handleConstructorArgs(usingArgs, constructorArgs, usingClass);
        }

        // 创建实例
        try {
            const injectMembersHandler = InjectMembersHandler.instance;
            injectMembersHandler.handleInstanceLazyMembers(usingClass);

            let instance: T;
            if (usingArgs.length > 0) {
                instance = new usingClass(...usingArgs);
            } else {
                instance = new usingClass();
            }

            injectMembersHandler.handleInstanceMembers(usingClass, <ObjectType>instance);

            const injectableOptions = DependenciesClassCollector.instance.getInjectableOptions(usingClass);

            switch (injectableOptions.setTo) {
                case 'inextensible':
                    Object.preventExtensions(instance);
                    break;

                case 'sealed':
                    Object.seal(instance);
                    break;

                case 'frozen':
                    Object.freeze(instance);
                    break;
            }

            this.creatingInstanceClassQueue.pop();

            return instance;
        } catch (error) {
            Message.throwError(
                '39001',
                `依赖注入容器实例化类 "${usingClass?.name}" 出错！${messageNewLineSign}${
                    /* c8 ignore next */
                    (<{ stack: unknown }>error)?.stack ?? error
                }`
            );
        }
    }

    /** 检测循环依赖 */
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

    // 判断构造方法参数是否可注入，如果可注入则去查找该依赖
    private handleConstructorArgs(usingArgs: unknown[], constructorArgs: unknown[], usingClass: NormalClass): void {
        if (usingArgs.length > constructorArgs.length) {
            Message.warn('20001', `为 "${usingClass?.name}" 的构造方法配置的参数过多！`);
        } else if (usingArgs.length < constructorArgs.length) {
            // 如果提供的参数个数过少，则用AUTO补全
            const padLength = constructorArgs.length - usingArgs.length;
            for (let i = 0; i < padLength; i++) {
                usingArgs.push(AUTO);
            }
        }

        const dependenciesClassCollector = DependenciesClassCollector.instance;

        for (let i = 0; i < usingArgs.length; i++) {
            if (usingArgs[i] === AUTO) {
                if (typeof constructorArgs[i] === 'function') {
                    const isInjectable = dependenciesClassCollector.contains(<Class>constructorArgs[i]);
                    if (isInjectable) {
                        usingArgs[i] = this.dependenciesSearcher.searchDependency(<Class>constructorArgs[i]);
                        continue;
                    }
                }
                usingArgs[i] = undefined;
            }
        }
    }

    static get instance(): DependenciesCreator {
        if (!DependenciesCreator._instance) {
            DependenciesCreator._instance = new DependenciesCreator();
        }
        return DependenciesCreator._instance;
    }
}
