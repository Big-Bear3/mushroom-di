import type { NormalClass, DependencyWeakKey, ObjectType } from '../types/diTypes';

/** 用于管理所有缓存依赖 */
export class CachedDependenciesContainer {
    private static instance: CachedDependenciesContainer;

    private static supportWeakRef = WeakRef ? true : false;

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
        this.cachedDependencyKeysMap.set(nc, CachedDependenciesContainer.supportWeakRef ? new WeakRef(key) : key);
    }

    getDependencyKey(nc: NormalClass): ObjectType {
        const key = this.cachedDependencyKeysMap.get(nc);
        if (!key) return undefined;

        return CachedDependenciesContainer.supportWeakRef ? (<WeakRef<ObjectType>>key).deref() : <ObjectType>key;
    }

    static getInstance(): CachedDependenciesContainer {
        if (!CachedDependenciesContainer.instance) {
            CachedDependenciesContainer.instance = new CachedDependenciesContainer();
        }
        return CachedDependenciesContainer.instance;
    }
}
