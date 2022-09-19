import { stopDeepConfig } from '../../src/constants/diConstants';
import { DependenciesConfigCollector } from '../../src/dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { Message } from '../../src/utils/message';
import { SingletonDependenciesHolder } from '../dependencies-holder/singletonDependenciesHolder';
import { DependencyConfigResult, InjectorType } from '../types/diTypes';
import { DependenciesCollector } from './dependenciesCollector';
import { DependenciesCreator } from './dependenciesCreator';

export class DependenciesSearcher {
    private static instance: DependenciesSearcher;

    searchDependency<T>(c: Class<T>, args?: any[]): T {
        const dependenciesCreator = DependenciesCreator.getInstance();
        const { usingClass, usingArgs, usingObject } = this.getUsingsByConfig(c, args);
        if (usingObject) return usingObject;

        const injectType = DependenciesCollector.getInstance().get(usingClass).type;
        if (injectType === 'singleton') {
            let instance = this.getInstanceFromHolder(<NormalClass>usingClass, injectType);
            if (instance) return instance;
            else {
                instance = dependenciesCreator.createDependency(<NormalClass>usingClass, usingArgs);
                this.addInstanceToHolder(<NormalClass>usingClass, instance, injectType);
                return instance;
            }
        }

        return dependenciesCreator.createDependency(<NormalClass>usingClass, usingArgs);
    }

    // 获取依赖配置的结果
    private getUsingsByConfig<T>(originalClass: Class<T>, originalArgs?: any[]): DependencyConfigResult<T> {
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

    private getInstanceFromHolder<T>(usingClass: NormalClass<T>, injectType: InjectorType): T {
        switch (injectType) {
            case 'singleton':
                if (injectType === 'singleton') {
                    const singletonDependenciesHolder = SingletonDependenciesHolder.getInstance();
                    const singletonInstance = singletonDependenciesHolder.getDependency(<NormalClass>usingClass);
                    if (singletonInstance) return singletonInstance;
                    return undefined;
                }
                break;

            default:
                return undefined;
        }
    }

    private addInstanceToHolder<T>(usingClass: NormalClass<T>, instance: T, injectType: InjectorType): void {
        if (injectType === 'singleton') {
            const singletonDependenciesHolder = SingletonDependenciesHolder.getInstance();
            singletonDependenciesHolder.addDependency(<NormalClass>usingClass, instance);
        }
    }

    static getInstance(): DependenciesSearcher {
        if (!DependenciesSearcher.instance) {
            DependenciesSearcher.instance = new DependenciesSearcher();
        }
        return DependenciesSearcher.instance;
    }
}
