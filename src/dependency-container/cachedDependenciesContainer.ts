import type { NormalClass, WeakKeyedDependencyKey } from '../types/diTypes';

/** 用于管理所有缓存依赖 */
export class CachedDependenciesContainer {
    private static instance: CachedDependenciesContainer;

    private cachedDependenciesMap = new Map<NormalClass, WeakMap<WeakKeyedDependencyKey, any>>();

    addDependency<T>(nc: NormalClass<T>, instance: T, key: WeakKeyedDependencyKey): void {
        let instanceWeakMap = this.cachedDependenciesMap.get(nc);
        if (!instanceWeakMap) {
            instanceWeakMap = new WeakMap();
            this.cachedDependenciesMap.set(nc, instanceWeakMap);
        }
        instanceWeakMap.set(key, instance);
    }

    getDependency<T>(nc: NormalClass<T>, key?: WeakKeyedDependencyKey): T {
        return this.cachedDependenciesMap.get(nc)?.get(key);
    }

    removeDependency<T>(nc: NormalClass<T>, key?: WeakKeyedDependencyKey): boolean {
        const isReallyDelete = this.cachedDependenciesMap.get(nc)?.delete(key);
        if (isReallyDelete) return true;
        return false;
    }

    static getInstance(): CachedDependenciesContainer {
        if (!CachedDependenciesContainer.instance) {
            CachedDependenciesContainer.instance = new CachedDependenciesContainer();
        }
        return CachedDependenciesContainer.instance;
    }
}
