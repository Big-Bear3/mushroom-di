import type { Class } from '../types/diTypes';

import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';

/** 级联判断父类注入类型是否是单例的 */
export function parentsIsSingleton(c: Class): boolean {
    const dependenciesClassCollector = DependenciesClassCollector.instance;
    let parentClass = <Class>Reflect.getPrototypeOf(c);
    while (parentClass) {
        if (dependenciesClassCollector.contains(parentClass)) {
            const parentInjectableOptions = dependenciesClassCollector.getInjectableOptions(parentClass);
            if (parentInjectableOptions?.type === 'singleton') return true;
        }

        parentClass = <Class>Reflect.getPrototypeOf(parentClass);
    }
    return false;
}
