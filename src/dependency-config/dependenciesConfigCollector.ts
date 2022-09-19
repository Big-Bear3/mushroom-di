import { Message } from '../../src/utils/message';
import { ConfigMethod } from '../types/diTypes';

export class DependenciesConfigCollector {
    private static instance: DependenciesConfigCollector;

    private dependenciesConfigMap = new Map<Class, ConfigMethod>();

    private constructor() {}

    collect(c: Class, configMethod: ConfigMethod): void {
        if (this.dependenciesConfigMap.has(c)) Message.warn('20003', `您在多处进行了 "${c.name}" 的依赖配置`);
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
