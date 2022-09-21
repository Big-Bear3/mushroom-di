import { NormalClass } from '../../src/types/diTypes';

export class SingletonDependenciesManager {
    private static instance: SingletonDependenciesManager;

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
