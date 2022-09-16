import { DependenciesCollector } from '../dependency/dependenciesCollector';

export function parentsIsSingleton(c: Class): boolean {
    const dependenciesCollector = DependenciesCollector.getInstance();
    let parentClass = <Class>Reflect.getPrototypeOf(c);
    while (parentClass) {
        const parentInjectableOptions = dependenciesCollector.get(parentClass);
        if (parentInjectableOptions.type === 'singleton') return true;

        parentClass = <Class>Reflect.getPrototypeOf(parentClass);
    }
    return false;
}
