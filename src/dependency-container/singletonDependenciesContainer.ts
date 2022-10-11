import type { NormalClass } from '../types/diTypes';

/** 用于管理所有单例依赖 */
export class SingletonDependenciesContainer {
    private static instance: SingletonDependenciesContainer;

    private singletonDependenciesMap = new Map<NormalClass, any>();

    addDependency<T>(nc: NormalClass<T>, instance: T): void {
        this.singletonDependenciesMap.set(nc, instance);
    }

    getDependency<T>(nc: NormalClass<T>): T {
        return this.singletonDependenciesMap.get(nc);
    }

    removeDependency<T>(nc: NormalClass<T>): boolean {
        return this.singletonDependenciesMap.delete(nc);
    }

    static getInstance(): SingletonDependenciesContainer {
        if (!SingletonDependenciesContainer.instance) {
            SingletonDependenciesContainer.instance = new SingletonDependenciesContainer();
        }
        return SingletonDependenciesContainer.instance;
    }
}
