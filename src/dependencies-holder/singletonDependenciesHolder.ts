export class SingletonDependenciesHolder {
    private static instance: SingletonDependenciesHolder;

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

    static getInstance(): SingletonDependenciesHolder {
        if (!SingletonDependenciesHolder.instance) {
            SingletonDependenciesHolder.instance = new SingletonDependenciesHolder();
        }
        return SingletonDependenciesHolder.instance;
    }
}
