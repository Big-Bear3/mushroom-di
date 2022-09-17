import 'reflect-metadata';
import { SingletonDependenciesHolder } from '../../src/dependencies-holder/singletonDependenciesHolder';
import { DependencyConfigResult, InjectorType } from '../../src/types/diTypes';
import { stopDeepConfig } from '../constants/diConstants';
import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';
import { Message } from '../utils/message';
import { DependenciesCollector } from './dependenciesCollector';
import { DependenciesGraph } from './dependenciesGraph';

export class DependenciesCreator {
    private static instance: DependenciesCreator;

    private dependenciesGraph = new DependenciesGraph();
    private creatingInstanceClassQueue: NormalClass[] = [];

    private isInjecting = false;

    getDependency<T>(c: Class<T>, args?: any[]): T {
        let isRootInjection = false;
        if (!this.isInjecting) {
            this.isInjecting = true;
            isRootInjection = true;
        }

        const instance = this.getOrCreateInstance(c, args);

        if (isRootInjection) DependenciesCreator.instance = null;

        return instance;
    }

    // 递归创建依赖实例，以及依赖构造方法中可注入的参数项的实例
    getOrCreateInstance<T>(c: Class<T>, args?: any[], outerClass?: Class): T {
        let { usingClass, usingArgs, usingObject } = this.getUsingsByConfig(c, args);
        if (usingObject) return usingObject;

        const injectType = DependenciesCollector.getInstance().get(usingClass).type;
        const heldInstance = this.getInstanceFromHolder(<NormalClass>usingClass, injectType);
        if (heldInstance) return heldInstance;

        this.checkCircularDependencies(<NormalClass>usingClass, outerClass);

        // 为构造方法参数注入实例
        const constructorArgs: Function[] = Reflect.getMetadata('design:paramtypes', usingClass);
        if (constructorArgs) {
            this.handleConstructorArgs(usingArgs, constructorArgs, <NormalClass>usingClass);
        }

        // 创建实例
        try {
            this.creatingInstanceClassQueue.push(<NormalClass>usingClass);

            let instance: T;
            if (usingArgs.length > 0) {
                instance = new (<NormalClass>usingClass)(...usingArgs);
            } else {
                instance = new (<NormalClass>usingClass)();
            }

            this.addInstanceToHolder(<NormalClass>usingClass, instance, injectType);

            this.creatingInstanceClassQueue.pop();

            return instance;
        } catch (error: any) {
            Message.throwError('39001', `依赖注入容器实例化类 "${usingClass.name}" 出错！\n ${error?.stack || error}`);
        }

        return undefined;
    }

    // 获取依赖配置的结果
    getUsingsByConfig<T>(originalClass: Class<T>, originalArgs?: any[]): DependencyConfigResult<T> {
        let usingClass: Class<T>;
        let usingArgs = originalArgs || [];

        let currentUsingClass = originalClass;
        while (usingClass !== currentUsingClass) {
            usingClass = currentUsingClass;

            let configEntity: DependencyConfigEntity<any, any[]>;

            const configMethod = DependenciesConfigCollector.getInstance().get(currentUsingClass);
            if (configMethod) {
                configEntity = new DependencyConfigEntity(currentUsingClass, usingArgs);
                const configResult = configMethod(configEntity);

                if (configResult && configResult !== stopDeepConfig) {
                    if (configResult instanceof originalClass) {
                        return { usingObject: configResult };
                    }
                    Message.throwError('29002', `配置的对象不是 "${originalClass.name}" 或其子类的实例`);
                }

                currentUsingClass = configEntity.usingClass;
                usingArgs = configEntity.args;

                if (configResult === stopDeepConfig) break;
            }
        }

        return { usingClass, usingArgs };
    }

    // 检测循环依赖
    checkCircularDependencies(usingClass: NormalClass, outerClass: Class): void {
        let realOuterClass: Class;
        if (outerClass) realOuterClass = outerClass;
        else if (this.creatingInstanceClassQueue.length > 0)
            realOuterClass = this.creatingInstanceClassQueue[this.creatingInstanceClassQueue.length - 1];

        const circularDependencyClasses = this.dependenciesGraph.addNodeAndCheckRing(usingClass, realOuterClass);
        if (circularDependencyClasses) {
            const circularDependencyClassNames = circularDependencyClasses.map((cdc) => cdc.name).join(' -> ');
            Message.throwError('39002', `检测到循环依赖：${circularDependencyClassNames}`);
        }
    }

    handleConstructorArgs(usingArgs: any[], constructorArgs: any[], usingClass: NormalClass): void {
        if (usingArgs.length > constructorArgs.length) {
            Message.warn('20001', `为 "${usingClass.name}" 的构造方法配置的参数过多！`);
        } else if (usingArgs.length < constructorArgs.length) {
            const padLength = constructorArgs.length - usingArgs.length;
            for (let i = 0; i < padLength; i++) {
                usingArgs.push(AUTO);
            }
        }

        const dependenciesCollector = DependenciesCollector.getInstance();

        for (let i = 0; i < usingArgs.length; i++) {
            if (usingArgs[i] === AUTO) {
                const isInjectable = dependenciesCollector.contains(constructorArgs[i]);
                if (isInjectable) {
                    usingArgs[i] = this.getOrCreateInstance(constructorArgs[i], undefined, usingClass);
                } else {
                    usingArgs[i] = undefined;
                }
            }
        }
    }

    getInstanceFromHolder<T>(usingClass: NormalClass<T>, injectType: InjectorType): T {
        if (injectType === 'singleton') {
            const singletonDependenciesHolder = SingletonDependenciesHolder.getInstance();
            const singletonInstance = singletonDependenciesHolder.getDependency(<NormalClass>usingClass);
            if (singletonInstance) return singletonInstance;
        }
    }

    addInstanceToHolder<T>(usingClass: NormalClass<T>, instance: T, injectType: InjectorType): void {
        if (injectType === 'singleton') {
            const singletonDependenciesHolder = SingletonDependenciesHolder.getInstance();
            singletonDependenciesHolder.addDependency(<NormalClass>usingClass, instance);
        }
    }

    static getInstance(): DependenciesCreator {
        if (!DependenciesCreator.instance) {
            DependenciesCreator.instance = new DependenciesCreator();
        }
        return DependenciesCreator.instance;
    }
}
