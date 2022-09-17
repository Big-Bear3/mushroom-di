import { IInjector } from './injectorInterface';

class SingletonDependencyInfo<T = any> {
    private instance: T;

    constructor(instance: T) {
        this.instance = instance;
    }

    getInstance(): T {
        return this.instance;
    }
}

export class SingletonInjector implements IInjector {
    private static instance: SingletonInjector;

    private singletonDependenciesMap = new WeakMap<NormalClass, SingletonDependencyInfo>();

    private constructor() {}

    inject<T>(c: NormalClass<T>, ...args: any[]): T {
        let dependencyInfo = this.singletonDependenciesMap.get(c);
        if (dependencyInfo) return dependencyInfo.getInstance();

        dependencyInfo = this.assembleDependencyInfo(c, args);
        this.singletonDependenciesMap.set(c, dependencyInfo);
        return dependencyInfo.getInstance();
    }

    private assembleDependencyInfo<T>(c: NormalClass<T>, args: any[]): SingletonDependencyInfo {
        const TargetClass = c;
        let instance: T;
        if (args.length > 0) {
            instance = new TargetClass(...args);
        } else {
            instance = new TargetClass();
        }
        return new SingletonDependencyInfo(instance);
    }

    instanceIsExisted(c: NormalClass): boolean {
        return this.singletonDependenciesMap.has(c);
    }

    destroyInstance(c: NormalClass): void {
        this.singletonDependenciesMap.delete(c);
    }

    static getInstance(): SingletonInjector {
        if (!SingletonInjector.instance) {
            SingletonInjector.instance = new SingletonInjector();
        }
        return SingletonInjector.instance;
    }
}
