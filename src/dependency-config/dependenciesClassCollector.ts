import type { Class, InjectableOptions } from '../types/diTypes';

import { defaultInjectableOptions } from '../constants/diConstants';

/** 用于收集被注入依赖的选项 */
export class DependenciesClassCollector {
    private static instance: DependenciesClassCollector;

    /** 类和被注入依赖的选项的映射 */
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
