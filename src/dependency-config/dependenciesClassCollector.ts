import type { Class, InjectableOptions } from '../types/diTypes';

import { defaultInjectableOptions } from '../constants/diConstants';

/** 用于收集被注入依赖的选项 */
export class DependenciesClassCollector {
    private static _instance: DependenciesClassCollector;

    /** 类和被注入依赖的选项的映射 */
    private dependenciesMap = new Map<Class, InjectableOptions>();

    collect(c: Class, injectableOptions: InjectableOptions): void {
        this.dependenciesMap.set(c, injectableOptions);
    }

    getInjectableOptions(c: Class): InjectableOptions {
        return this.dependenciesMap.get(c) ?? defaultInjectableOptions;
    }

    contains(c: Class): boolean {
        return this.dependenciesMap.has(c);
    }

    private constructor() {}

    static get instance(): DependenciesClassCollector {
        if (!DependenciesClassCollector._instance) {
            DependenciesClassCollector._instance = new DependenciesClassCollector();
        }
        return DependenciesClassCollector._instance;
    }
}
