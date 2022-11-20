import type { Class, ConfigMethod } from '../types/diTypes';

import { Message } from '../utils/message';

/** 用于收集配置依赖的自定义方法 */
export class DependenciesConfigCollector {
    private static _instance: DependenciesConfigCollector;

    /** 类和配置依赖的自定义方法的映射 */
    private dependenciesConfigMap = new Map<Class, ConfigMethod>();

    /** Symbol和配置依赖的自定义方法的映射 */
    private dependenciesSymbolConfigMap = new Map<symbol, ConfigMethod>();

    private constructor() {}

    collect(cs: Class | symbol, configMethod: ConfigMethod): void {
        if (typeof cs === 'symbol') {
            if (this.dependenciesSymbolConfigMap.has(cs)) Message.warn('20004', `您在多处进行了 "${cs.toString()}" 的依赖配置！`);
            this.dependenciesSymbolConfigMap.set(cs, configMethod);
        } else {
            if (this.dependenciesConfigMap.has(cs)) Message.warn('20003', `您在多处进行了 "${cs.name}" 的依赖配置！`);
            this.dependenciesConfigMap.set(cs, configMethod);
        }
    }

    getConfigMethod(cs: Class | symbol): ConfigMethod {
        if (typeof cs === 'symbol') return this.dependenciesSymbolConfigMap.get(cs);
        return this.dependenciesConfigMap.get(cs);
    }

    static get instance(): DependenciesConfigCollector {
        if (!DependenciesConfigCollector._instance) {
            DependenciesConfigCollector._instance = new DependenciesConfigCollector();
        }
        return DependenciesConfigCollector._instance;
    }
}
