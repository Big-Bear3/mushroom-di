import type { Class, NormalClass, DependencyConfigResult, InjectType } from '../types/diTypes';

import { messageNewLineSign, STOP_DEEP_CONFIG } from '../../src/constants/diConstants';
import { DependenciesConfigCollector } from '../../src/dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { Message } from '../../src/utils/message';
import { SingletonDependenciesManager } from '../dependency-manager/singletonDependenciesManager';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { DependenciesCreator } from './dependenciesCreator';

export class DependenciesSearcher {
    private static instance: DependenciesSearcher;

    /** 根据依赖配置查找或创建依赖 */
    searchDependency<T>(c: Class<T>, args?: any[]): T {
        // 读取依赖配置
        const { usingClass, usingArgs, usingObject } = this.getUsingsByConfig(c, args);
        if (usingObject) return usingObject;

        // 获取注入方式
        const injectType = DependenciesClassCollector.getInstance().getInjectableOptions(usingClass).type;
        if (injectType === 'singleton') {
            let instance = this.getInstanceFromManager(<NormalClass>usingClass, injectType);
            if (instance) {
                if (usingArgs.length > 0)
                    Message.warn(
                        '20002',
                        `您试图在为一个已创建的单例依赖传入构造方法参数，这些参数将不会生效！${messageNewLineSign}class: ${usingClass.name}`
                    );
                return instance;
            } else {
                instance = DependenciesCreator.getInstance().createDependency(<NormalClass>usingClass, usingArgs);
                this.addInstanceToManager(<NormalClass>usingClass, instance, injectType);
                return instance;
            }
        }

        return DependenciesCreator.getInstance().createDependency(<NormalClass>usingClass, usingArgs);
    }

    /** 获取依赖配置的结果 */
    private getUsingsByConfig<T>(originalClass: Class<T>, originalArgs?: any[]): DependencyConfigResult<T> {
        let usingClass: Class<T>;
        let usingArgs = originalArgs || [];

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
                        return { usingObject: configResult };
                    }
                    Message.throwError('29002', `配置的对象不是 "${originalClass.name}" 或其子类的实例`);
                }

                currentUsingClass = configEntity.usingClass;
                usingArgs = configEntity.args;

                if (configResult === STOP_DEEP_CONFIG) return { usingClass: currentUsingClass, usingArgs };
            }
        }

        return { usingClass, usingArgs };
    }

    /** 从依赖管理器中获取实例 */
    private getInstanceFromManager<T>(usingClass: NormalClass<T>, injectType: InjectType): T {
        switch (injectType) {
            case 'singleton':
                return SingletonDependenciesManager.getInstance().getDependency(<NormalClass>usingClass);

            default:
                return undefined;
        }
    }

    /** 向依赖管理器中添加实例 */
    private addInstanceToManager<T>(usingClass: NormalClass<T>, instance: T, injectType: InjectType): void {
        switch (injectType) {
            case 'singleton':
                SingletonDependenciesManager.getInstance().addDependency(<NormalClass>usingClass, instance);
                break;

            default:
                break;
        }
    }

    static getInstance(): DependenciesSearcher {
        if (!DependenciesSearcher.instance) {
            DependenciesSearcher.instance = new DependenciesSearcher();
        }
        return DependenciesSearcher.instance;
    }
}
