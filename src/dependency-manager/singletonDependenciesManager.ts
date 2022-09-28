import type { NormalClass } from '../../src/types/diTypes';

/** 用于管理所有单例依赖 */
export class SingletonDependenciesManager {
    private static instance: SingletonDependenciesManager;

    /** 类和单例依赖的映射 */
    private singletonDependenciesMap = new WeakMap<NormalClass, any>();

    addDependency<T>(nc: NormalClass<T>, instance: T): void {
        this.singletonDependenciesMap.set(nc, instance);
    }

    getDependency<T>(nc: NormalClass<T>): T {
        return this.singletonDependenciesMap.get(nc);
    }

    removeDependency<T>(nc: NormalClass<T>): void {
        this.singletonDependenciesMap.delete(nc);
    }

    static getInstance(): SingletonDependenciesManager {
        if (!SingletonDependenciesManager.instance) {
            SingletonDependenciesManager.instance = new SingletonDependenciesManager();
        }
        return SingletonDependenciesManager.instance;
    }
}
