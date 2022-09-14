import { DependenciesConfigCollector } from '../dependency-config/dependenciesConfigCollector';
import { ConfigMethod, MethodDescriptor } from '../types/diTypes';

export function DependencyConfig(c: Class): MethodDecorator {
    return ((_target: any, _key: string, methodDescriptor: MethodDescriptor) => {
        const dependenciesConfigCollector = DependenciesConfigCollector.getInstance();
        dependenciesConfigCollector.collect(c, methodDescriptor.value as ConfigMethod);
    }) as MethodDecorator;
}
