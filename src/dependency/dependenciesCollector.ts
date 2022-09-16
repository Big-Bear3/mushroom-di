import { InjectableOptions } from '../types/diTypes';

export class DependenciesCollector {
    private static instance: DependenciesCollector;

    private dependenciesMap = new Map<Class, InjectableOptions>();

    collect(c: Class, injectableOptions: InjectableOptions): void {
        let options = injectableOptions;
        this.dependenciesMap.set(c, options);
    }

    get(c: Class): InjectableOptions {
        return this.dependenciesMap.get(c);
    }

    contains(c: Class): boolean {
        return this.dependenciesMap.has(c);
    }

    private constructor() {}

    static getInstance(): DependenciesCollector {
        if (!DependenciesCollector.instance) {
            DependenciesCollector.instance = new DependenciesCollector();
        }
        return DependenciesCollector.instance;
    }
}
