import { defaultInjectableOptions } from '../constants/diConstants';
import { InjectableOptions } from '../types/diTypes';

export class DependenciesClassCollector {
    private static instance: DependenciesClassCollector;

    private dependenciesMap = new Map<Class, InjectableOptions>();

    collect(c: Class, injectableOptions: InjectableOptions): void {
        this.dependenciesMap.set(c, injectableOptions);
    }

    getInjectableOptions(c: Class): InjectableOptions {
        return this.dependenciesMap.get(c) || defaultInjectableOptions;
    }

    contains(c: Class): boolean {
        return this.dependenciesMap.has(c);
    }

    private constructor() {}

    static getInstance(): DependenciesClassCollector {
        if (!DependenciesClassCollector.instance) {
            DependenciesClassCollector.instance = new DependenciesClassCollector();
        }
        return DependenciesClassCollector.instance;
    }
}
