import type { Class, ConfigMethod, MethodDescriptor } from '../types/diTypes';

import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';

/**
 * DependencyConfig() 装饰器
 */
export function DependencyConfig(c: Class): MethodDecorator {
    return ((_target: any, _key: string, methodDescriptor: MethodDescriptor) => {
        const dependenciesConfigCollector = DependenciesConfigCollector.getInstance();
        dependenciesConfigCollector.collect(c, methodDescriptor.value as ConfigMethod);
    }) as MethodDecorator;
}
