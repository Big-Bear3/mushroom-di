import type { Class, NormalClass, DependencyConfigResult, ObjectType } from '../types/diTypes';

import { messageNewLineSign, STOP_DEEP_CONFIG } from '../constants/diConstants';
import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';
import { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';
import { Message } from '../utils/message';
import { SingletonDependenciesContainer } from '../dependency-container/singletonDependenciesContainer';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { DependenciesCreator } from './dependenciesCreator';
import { CachedDependenciesContainer } from '../dependency-container/cachedDependenciesContainer';

export class DependenciesSearcher {
    private static _instance: DependenciesSearcher;

    /** 根据依赖配置查找或创建依赖 */
    searchDependency<T>(c: Class<T>, args?: unknown[]): T {
        /* c8 ignore next */
        if (!c) return undefined;

        // 读取依赖配置
        const { usingClass, usingArgs, usingObject, afterInstanceCreate, afterInstanceFetch } = this.getUsingsByConfig(c, args);
        if (usingObject) {
            afterInstanceFetch?.(usingObject, false);
            return usingObject;
        }

        if (typeof usingClass !== 'function') Message.throwError('29014', `配置使用的Class(${usingClass})无效！`);
        if (!Array.isArray(usingArgs)) Message.throwError('29015', `配置的构造方法参数(${usingArgs})无效！`);
        if (afterInstanceCreate && typeof afterInstanceCreate !== 'function')
            Message.throwError('29016', '配置的afterInstanceCreate必须是函数！');
        if (afterInstanceFetch && typeof afterInstanceFetch !== 'function')
            Message.throwError('29017', '配置的afterInstanceFetch必须是函数！');

        // 获取注入方式
        const injectableOptions = DependenciesClassCollector.instance.getInjectableOptions(usingClass);
        let instance: T;

        switch (injectableOptions.type) {
            case 'singleton':
                const singletonDependenciesContainer = SingletonDependenciesContainer.instance;
                instance = singletonDependenciesContainer.getDependency(usingClass);
                if (instance) {
                    afterInstanceFetch?.(instance, false);
                } else {
                    instance = DependenciesCreator.instance.createDependency(usingClass, usingArgs);
                    singletonDependenciesContainer.addDependency(usingClass, instance);

                    afterInstanceCreate?.(instance);
                    afterInstanceFetch?.(instance, true);
                }
                break;
            case 'cached':
                const cachedDependenciesContainer = CachedDependenciesContainer.instance;
                let key = cachedDependenciesContainer.getDependencyKey(usingClass);
                if (key) {
                    instance = cachedDependenciesContainer.getDependency(usingClass, key);
                    afterInstanceFetch?.(instance, false);
                } else {
                    instance = DependenciesCreator.instance.createDependency(usingClass, usingArgs);

                    if (injectableOptions.follow) {
                        key = injectableOptions.follow.call(instance, instance);
                    } else {
                        key = <ObjectType>instance;
                    }

                    if (!key)
                        Message.throwError(
                            '29007',
                            `follow方法的返回值不能为空！${messageNewLineSign}class: ${usingClass?.name}, 返回值: ${key}`
                        );
                    if (typeof key !== 'object')
                        Message.throwError(
                            '29008',
                            `follow方法的返回值必须是对象类型！${messageNewLineSign}class: ${usingClass?.name}, 返回值: ${key}`
                        );

                    cachedDependenciesContainer.addDependencyKey(usingClass, key);
                    cachedDependenciesContainer.addDependency(usingClass, instance, key);

                    afterInstanceCreate?.(instance);
                    afterInstanceFetch?.(instance, true);
                }
                break;

            default:
                instance = DependenciesCreator.instance.createDependency(usingClass, usingArgs);

                afterInstanceCreate?.(instance);
                afterInstanceFetch?.(instance, true);
                break;
        }

        return instance;
    }

    /** 获取依赖配置的结果 */
    private getUsingsByConfig<T>(originalClass: Class<T>, originalArgs?: unknown[]): DependencyConfigResult<T> {
        let usingClass: Class<T>;
        let usingArgs = originalArgs ?? [];
        let afterInstanceCreate: (instance: T) => void;
        let afterInstanceFetch: (instance: T, isNew: boolean) => void;

        let currentUsingClass = originalClass;
        while (usingClass !== currentUsingClass) {
            usingClass = currentUsingClass;

            let configEntity: DependencyConfigEntity<Class, unknown[]>;

            // 获取自定义配置依赖方法
            const configMethod = DependenciesConfigCollector.instance.getConfigMethod(currentUsingClass);
            if (configMethod) {
                configEntity = new DependencyConfigEntity(currentUsingClass, usingArgs);

                // 正在创建依赖的实例所属的类
                const outerClass = DependenciesCreator.instance.getCreatingInstanceClass();

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
                    Message.throwError('29002', `配置的对象不是 "${originalClass?.name}" 或其子类的实例`);
                }

                currentUsingClass = configEntity.usingClass;
                usingArgs = configEntity.args;
                afterInstanceCreate = configEntity.afterInstanceCreate;
                afterInstanceFetch = configEntity.afterInstanceFetch;

                if (configResult === STOP_DEEP_CONFIG)
                    return {
                        usingClass: <NormalClass>currentUsingClass,
                        usingArgs: usingArgs ?? [],
                        afterInstanceCreate,
                        afterInstanceFetch
                    };
            }
        }

        return {
            usingClass: <NormalClass>usingClass,
            usingArgs: usingArgs ?? [],
            afterInstanceCreate,
            afterInstanceFetch
        };
    }

    static get instance(): DependenciesSearcher {
        if (!DependenciesSearcher._instance) {
            DependenciesSearcher._instance = new DependenciesSearcher();
        }
        return DependenciesSearcher._instance;
    }
}
