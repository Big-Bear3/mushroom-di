import type { Class, ConfigMethod } from '../types/diTypes';

import { Message } from '../utils/message';

/** 用于收集配置依赖的自定义方法 */
export class DependenciesConfigCollector {
    private static _instance: DependenciesConfigCollector;

    /** 类和配置依赖的自定义方法的映射 */
    private dependenciesConfigMap = new Map<Class, ConfigMethod>();

    private constructor() {}

    collect(c: Class, configMethod: ConfigMethod): void {
        if (this.dependenciesConfigMap.has(c)) Message.warn('20003', `您在多处进行了 "${c.name}" 的依赖配置！`);
        this.dependenciesConfigMap.set(c, configMethod);
    }

    getConfigMethod(c: Class): ConfigMethod {
        return this.dependenciesConfigMap.get(c);
    }

    static get instance(): DependenciesConfigCollector {
        if (!DependenciesConfigCollector._instance) {
            DependenciesConfigCollector._instance = new DependenciesConfigCollector();
        }
        return DependenciesConfigCollector._instance;
    }
}
