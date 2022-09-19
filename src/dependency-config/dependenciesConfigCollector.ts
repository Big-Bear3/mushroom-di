import { ConfigMethod } from '../types/diTypes';

export class DependenciesConfigCollector {
    private static instance: DependenciesConfigCollector;

    private dependenciesConfigMap = new Map<Class, ConfigMethod>();

    private constructor() {}

    collect(c: Class, configMethod: ConfigMethod): void {
        this.dependenciesConfigMap.set(c, configMethod);
    }

    getConfigMethod(c: Class): ConfigMethod {
        return this.dependenciesConfigMap.get(c);
    }

    static getInstance(): DependenciesConfigCollector {
        if (!DependenciesConfigCollector.instance) {
            DependenciesConfigCollector.instance = new DependenciesConfigCollector();
        }
        return DependenciesConfigCollector.instance;
    }
}
