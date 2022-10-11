import type { Class, NormalClass, DependencyConfigResult } from '../types/diTypes';

import { messageNewLineSign, STOP_DEEP_CONFIG } from '../../src/constants/diConstants';
import { DependenciesConfigCollector } from '../../src/dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { Message } from '../../src/utils/message';
import { SingletonDependenciesContainer } from '../dependency-container/singletonDependenciesContainer';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { DependenciesCreator } from './dependenciesCreator';

export class DependenciesSearcher {
    private static instance: DependenciesSearcher;

    /** 根据依赖配置查找或创建依赖 */
    searchDependency<T>(c: Class<T>, args?: any[]): T {
        // 读取依赖配置
        const { usingClass, usingArgs, usingObject, afterInstanceCreate, afterInstanceFetch } = this.getUsingsByConfig(c, args);
        if (usingObject) {
            afterInstanceFetch?.(usingObject, false);
            return usingObject;
        }

        // 获取注入方式
        const injectType = DependenciesClassCollector.getInstance().getInjectableOptions(usingClass).type;
        let instance: any;
        if (injectType === 'singleton') {
            const singletonDependenciesContainer = SingletonDependenciesContainer.getInstance();
            instance = singletonDependenciesContainer.getDependency(<NormalClass>usingClass);
            if (instance) {
                if (usingArgs.length > 0)
                    Message.warn(
                        '20002',
                        `您试图在为一个已创建的单例依赖传入构造方法参数，这些参数将不会生效！${messageNewLineSign}class: ${usingClass.name}`
                    );

                afterInstanceFetch?.(instance, false);
            } else {
                instance = DependenciesCreator.getInstance().createDependency(<NormalClass>usingClass, usingArgs);
                singletonDependenciesContainer.addDependency(<NormalClass>usingClass, instance);

                afterInstanceCreate?.(instance);
                afterInstanceFetch?.(instance, true);
            }
            return instance;
        }

        instance = DependenciesCreator.getInstance().createDependency(<NormalClass>usingClass, usingArgs);

        afterInstanceCreate?.(instance);
        afterInstanceFetch?.(instance, true);

        return instance;
    }

    /** 获取依赖配置的结果 */
    private getUsingsByConfig<T>(originalClass: Class<T>, originalArgs?: any[]): DependencyConfigResult<T> {
        let usingClass: Class<T>;
        let usingArgs = originalArgs || [];
        let afterInstanceCreate: (instance: T) => void;
        let afterInstanceFetch: (instance: T, isNew: boolean) => void;

        let currentUsingClass = originalClass;
        while (usingClass !== currentUsingClass) {
            usingClass = currentUsingClass;

            let configEntity: DependencyConfigEntity<any, any[]>;

            // 获取自定义配置依赖方法
            const configMethod = DependenciesConfigCollector.getInstance().getConfigMethod(currentUsingClass);
            if (configMethod) {
                configEntity = new DependencyConfigEntity(currentUsingClass, usingArgs);

                // 正在创建依赖的实例所属的类
                const outerClass = DependenciesCreator.getInstance().getCreatingInstanceClass();

                const configResult = configMethod(configEntity, outerClass);

                if (configResult && configResult !== STOP_DEEP_CONFIG) {
                    // 检测指定的依赖所属的类，是否是原始定义的类或其子类
                    if (configResult instanceof originalClass) {
                        return {
                            usingObject: configResult,
                            afterInstanceCreate: configEntity.afterInstanceCreate,
                            afterInstanceFetch: configEntity.afterInstanceFetch
                        };
                    }
                    Message.throwError('29002', `配置的对象不是 "${originalClass.name}" 或其子类的实例`);
                }

                currentUsingClass = configEntity.usingClass;
                usingArgs = configEntity.args;
                afterInstanceCreate = configEntity.afterInstanceCreate;
                afterInstanceFetch = configEntity.afterInstanceFetch;

                if (configResult === STOP_DEEP_CONFIG)
                    return {
                        usingClass: currentUsingClass,
                        usingArgs,
                        afterInstanceCreate,
                        afterInstanceFetch
                    };
            }
        }

        return {
            usingClass,
            usingArgs,
            afterInstanceCreate,
            afterInstanceFetch
        };
    }

    static getInstance(): DependenciesSearcher {
        if (!DependenciesSearcher.instance) {
            DependenciesSearcher.instance = new DependenciesSearcher();
        }
        return DependenciesSearcher.instance;
    }
}
