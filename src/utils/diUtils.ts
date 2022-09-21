import { Class } from '../../src/types/diTypes';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';

export function parentsIsSingleton(c: Class): boolean {
    const dependenciesCollector = DependenciesClassCollector.getInstance();
    let parentClass = <Class>Reflect.getPrototypeOf(c);
    while (parentClass) {
        const parentInjectableOptions = dependenciesCollector.getInjectableOptions(parentClass);
        if (parentInjectableOptions?.type === 'singleton') return true;

        parentClass = <Class>Reflect.getPrototypeOf(parentClass);
    }
    return false;
}
