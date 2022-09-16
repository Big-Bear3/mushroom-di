import 'reflect-metadata';
import { defaultInjectableOptions, stopDeepConfig } from '../constants/diConstants';
import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';
import { InjectorFactory } from '../injectors/injectorFactory';
import { SingletonInjector } from '../injectors/singletonInjector';
import { Message } from '../utils/message';
import { DependenciesCollector } from './dependenciesCollector';
import { DependenciesGraph } from './dependenciesGraph';

export class DependenciesCreator {
    private static instance: DependenciesCreator;

    private dependenciesGraph = new DependenciesGraph();
    private currentCreatingInstanceClass: NormalClass;

    private isInjecting = false;

    createInstance<T>(c: Class<T>, args?: any[]): T {
        let isRootInjection = false;
        if (!this.isInjecting) {
            this.isInjecting = true;
            isRootInjection = true;
        }

        const instance = this.createInstanceRecursive(c, args);

        if (isRootInjection) DependenciesCreator.instance = null;

        return instance;
    }

    // 递归创建依赖实例，以及依赖构造方法中可注入的参数项的实例
    createInstanceRecursive<T>(c: Class<T>, args?: any[], outerClass: Class = this.currentCreatingInstanceClass): T {
        let usingClass: Class<T>;
        let usingArgs = args || [];

        let currentUsingClass = c;

        // 获取依赖配置的结果
        while (usingClass !== currentUsingClass) {
            usingClass = currentUsingClass;

            let configEntity: DependencyConfigEntity<any, any[]>;

            const configMethod = DependenciesConfigCollector.getInstance().get(currentUsingClass);
            if (configMethod) {
                configEntity = new DependencyConfigEntity(currentUsingClass, usingArgs);
                const configResult = configMethod(configEntity);

                if (configResult && configResult !== stopDeepConfig) {
                    if (configResult instanceof c) {
                        return configResult;
                    }
                    Message.throwError('29002', `配置的对象不是 "${c.name}" 或其子类的实例`);
                }

                currentUsingClass = configEntity.usingClass;
                usingArgs = configEntity.args;

                if (configResult === stopDeepConfig) break;
            }
        }

        // 检测循环依赖
        const circularDependencyClasses = this.dependenciesGraph.addNodeAndCheckRing(usingClass, outerClass);
        if (circularDependencyClasses) {
            const circularDependencyClassNames = circularDependencyClasses.map((cdc) => cdc.name).join(' -> ');
            Message.throwError('39001', `检测到循环依赖：${circularDependencyClassNames}`);
        }

        // 为构造方法参数注入实例
        const dependenciesCollector = DependenciesCollector.getInstance();
        const injectableOptions = dependenciesCollector.get(usingClass) || defaultInjectableOptions;
        const usingClassType = injectableOptions.type;

        const targetInjector = InjectorFactory.getInjector(usingClassType);

        if (!(targetInjector instanceof SingletonInjector && targetInjector.instanceIsExisted(<NormalClass>usingClass))) {
            const constructorArgs: Function[] = Reflect.getMetadata('design:paramtypes', usingClass);
            if (constructorArgs) {
                this.handleConstructorArgs(usingArgs, constructorArgs, usingClass);
            }
        }

        // 创建实例
        try {
            this.currentCreatingInstanceClass = <NormalClass>usingClass;
            const instance = targetInjector.inject(<NormalClass>usingClass, ...usingArgs);
            this.currentCreatingInstanceClass = null;
            return instance;
        } catch (error: any) {
            Message.error('39002', `依赖注入容器实例化类 "${usingClass.name}" 出错！\n ${error?.stack || error}`);
        }

        return undefined;
    }

    handleConstructorArgs(usingArgs: any[], constructorArgs: any[], c: Class) {
        if (usingArgs.length > constructorArgs.length) {
            Message.warn('20001', `为 "${c.name}" 的构造方法配置的参数过多！`);
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
                    usingArgs[i] = this.createInstanceRecursive(constructorArgs[i], undefined, c);
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
