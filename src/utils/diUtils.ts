import type { Class } from '../types/diTypes';

import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';

/** 级联判断父类是否是单例的 */
export function parentsIsSingleton(c: Class): boolean {
    const dependenciesCollector = DependenciesClassCollector.instance;
    let parentClass = <Class>Reflect.getPrototypeOf(c);
    while (parentClass) {
        const parentInjectableOptions = dependenciesCollector.getInjectableOptions(parentClass);
        if (parentInjectableOptions?.type === 'singleton') return true;

        parentClass = <Class>Reflect.getPrototypeOf(parentClass);
    }
    return false;
}
