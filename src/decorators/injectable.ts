import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { parentsIsSingleton } from '../utils/diUtils';
import { defaultInjectableOptions } from '../constants/diConstants';
import { Message } from '../utils/message';
import { InjectableOptions } from '../types/diTypes';

export function Injectable(options: InjectableOptions = defaultInjectableOptions): ClassDecorator {
    return ((target: any) => {
        if (parentsIsSingleton(target)) {
            Message.throwError(
                '29001',
                `禁止继承依赖类型为 "singleton" 的类！ 如果您需要单例的子类，请单独在子类上使用 "@Injectable({ type: 'singleton' })"\n    class: ${target.name}`
            );
        }

        DependenciesClassCollector.getInstance().collect(target, options);

        return target;
    }) as ClassDecorator;
}
