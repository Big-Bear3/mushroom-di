import type { NormalClass, DependencyWeakKey, ObjectType } from '../types/diTypes';

/** 用于管理所有缓存依赖 */
export class CachedDependenciesContainer {
    private static _instance: CachedDependenciesContainer;

    private cachedDependenciesMap = new Map<NormalClass, WeakMap<DependencyWeakKey, any>>();

    private cachedDependencyKeysMap = new Map<NormalClass, WeakRef<ObjectType> | ObjectType>();

    addDependency<T>(nc: NormalClass<T>, instance: T, key: DependencyWeakKey): void {
        let instanceWeakMap = this.cachedDependenciesMap.get(nc);
        if (!instanceWeakMap) {
            instanceWeakMap = new WeakMap();
            this.cachedDependenciesMap.set(nc, instanceWeakMap);
        }
        instanceWeakMap.set(key, instance);
    }

    getDependency<T>(nc: NormalClass<T>, key: DependencyWeakKey): T {
        return this.cachedDependenciesMap.get(nc)?.get(key);
    }

    removeDependency<T>(nc: NormalClass<T>): boolean {
        this.cachedDependencyKeysMap.delete(nc);
        return this.cachedDependenciesMap.delete(nc);
    }

    addDependencyKey(nc: NormalClass, key: ObjectType): void {
        this.cachedDependencyKeysMap.set(nc, WeakRef ? new WeakRef(key) : key);
    }

    getDependencyKey(nc: NormalClass): ObjectType {
        const key = this.cachedDependencyKeysMap.get(nc);
        if (!key) return undefined;

        return WeakRef ? (<WeakRef<ObjectType>>key).deref() : <ObjectType>key;
    }

    static get instance(): CachedDependenciesContainer {
        if (!CachedDependenciesContainer._instance) {
            CachedDependenciesContainer._instance = new CachedDependenciesContainer();
        }
        return CachedDependenciesContainer._instance;
    }
}
