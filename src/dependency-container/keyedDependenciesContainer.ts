import type { NormalClass, DependencyKey, DependencyWeakKey } from '../types/diTypes';

import { Message } from '../utils/message';

/** 用于管理所有带有键的依赖 */
export class KeyedDependenciesContainer {
    private static _instance: KeyedDependenciesContainer;

    private keyedDependenciesMap = new Map<NormalClass, Map<DependencyKey, any>>();
    private weakKeyedDependenciesMap = new Map<NormalClass, WeakMap<DependencyWeakKey, any>>();

    addDependency<T>(nc: NormalClass<T>, instance: T, key: DependencyKey, isWeak?: boolean): void {
        if (isWeak) {
            if (typeof key !== 'object')
                /* c8 ignore next */
                Message.throwError('19001', '将非object类型用作了weakKeyedDependenciesMap对象中WeakMap的键！');

            this.keyedDependenciesMap.get(nc)?.delete(key);

            let instanceWeakMap = this.weakKeyedDependenciesMap.get(nc);
            if (!instanceWeakMap) {
                instanceWeakMap = new WeakMap();
                this.weakKeyedDependenciesMap.set(nc, instanceWeakMap);
            }

            instanceWeakMap.set(<DependencyWeakKey>key, instance);
        } else {
            if (typeof key === 'object') this.weakKeyedDependenciesMap.get(nc)?.delete(key);

            let instanceMap = this.keyedDependenciesMap.get(nc);
            if (!instanceMap) {
                instanceMap = new Map();
                this.keyedDependenciesMap.set(nc, instanceMap);
            }

            instanceMap.set(key, instance);
        }
    }

    getDependency<T>(nc: NormalClass<T>, key: DependencyKey): T {
        let instance = this.keyedDependenciesMap.get(nc)?.get(key);
        if (instance) return instance;

        if (typeof key === 'object') {
            instance = this.weakKeyedDependenciesMap.get(nc)?.get(key);
            if (instance) return instance;
        }
        return undefined;
    }

    containsDependency<T>(nc: NormalClass<T>, key: DependencyKey): boolean {
        let instance = this.keyedDependenciesMap.get(nc)?.has(key);
        if (instance) return true;

        if (typeof key === 'object') {
            instance = this.weakKeyedDependenciesMap.get(nc)?.has(key);
            if (instance) return true;
        }
        return false;
    }

    removeDependency<T>(nc: NormalClass<T>, key: DependencyKey): boolean {
        let isReallyDelete = this.keyedDependenciesMap.get(nc)?.delete(key);
        if (isReallyDelete) return true;

        if (!isReallyDelete && typeof key === 'object') {
            isReallyDelete = this.weakKeyedDependenciesMap.get(nc)?.delete(key);
            if (isReallyDelete) return true;
        }
        return false;
    }

    static get instance(): KeyedDependenciesContainer {
        if (!KeyedDependenciesContainer._instance) {
            KeyedDependenciesContainer._instance = new KeyedDependenciesContainer();
        }
        return KeyedDependenciesContainer._instance;
    }
}
