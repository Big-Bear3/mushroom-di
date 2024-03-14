import type { Class, ConfigMethod, MethodDescriptor } from '../types/diTypes';

import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';

/**
 * DependencyConfig() 装饰器
 * 用于装饰配置依赖的方法
 */
export function DependencyConfig(cs: Class | symbol): MethodDecorator {
    return ((_target: Class, _key: string, methodDescriptor: MethodDescriptor) => {
        const dependenciesConfigCollector = DependenciesConfigCollector.instance;
        dependenciesConfigCollector.collect(cs, methodDescriptor.value as ConfigMethod);
    }) as MethodDecorator;
}
