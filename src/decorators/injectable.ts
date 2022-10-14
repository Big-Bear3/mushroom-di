import type { Class, InjectableOptions, ObjectType } from '../types/diTypes';

import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { parentsIsSingleton } from '../utils/diUtils';
import { defaultInjectableOptions, messageNewLineSign } from '../constants/diConstants';
import { Message } from '../utils/message';

/**
 * Injectable() 装饰器
 */
export function Injectable<T extends ObjectType>(options: InjectableOptions<T> = defaultInjectableOptions): ClassDecorator {
    return ((target: Class) => {
        if (parentsIsSingleton(target)) {
            Message.throwError(
                '29001',
                '禁止继承依赖类型为 "singleton" 的类！ 如果您需要单例的子类，请单独在子类上使用 "@Injectable({ type: \'singleton\' })"' +
                    `${messageNewLineSign}class: ${target.name}`
            );
        }

        DependenciesClassCollector.getInstance().collect(target, options);

        return target;
    }) as ClassDecorator;
}
