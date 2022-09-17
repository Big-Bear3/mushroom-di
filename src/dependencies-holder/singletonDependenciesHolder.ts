export class SingletonDependenciesHolder {
    private static instance: SingletonDependenciesHolder;

    private singletonDependenciesMap = new WeakMap<NormalClass, any>();

    addDependency<T>(c: NormalClass<T>, instance: T): void {
        this.singletonDependenciesMap.set(c, instance);
    }

    getDependency<T>(c: NormalClass<T>): T {
        return this.singletonDependenciesMap.get(c);
    }

    static getInstance(): SingletonDependenciesHolder {
        if (!SingletonDependenciesHolder.instance) {
            SingletonDependenciesHolder.instance = new SingletonDependenciesHolder();
        }
        return SingletonDependenciesHolder.instance;
    }
}
