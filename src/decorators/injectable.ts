import type { Class, InjectableOptions, ObjectType } from '../types/diTypes';

import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';
import { parentsIsSingleton } from '../utils/diUtils';
import { defaultInjectableOptions, messageNewLineSign } from '../constants/diConstants';
import { Message } from '../utils/message';
import { DependenciesSearcher } from '../../src/dependency/dependenciesSearcher';

/**
 * Injectable() 装饰器
 */
export function Injectable<T extends ObjectType>(options: InjectableOptions<T> = defaultInjectableOptions): ClassDecorator {
    return function (target: Class) {
        if (parentsIsSingleton(target)) {
            Message.throwError(
                '29001',
                '禁止继承依赖类型为 "singleton" 的类！ 如果您需要单例的子类，请单独在子类上使用 "@Injectable({ type: \'singleton\' })"' +
                    `${messageNewLineSign}class: ${target.name}`
            );
        }

        DependenciesClassCollector.instance.collect(target, options);

        if (options.injectOnNew) {
            const fn = function (...args: unknown[]) {
                return DependenciesSearcher.instance.searchDependencyByClass(target, args);
            };

            const staticMemberNames = Reflect.ownKeys(target);
            for (const staticMemberName of staticMemberNames) {
                if (staticMemberName === 'length' || staticMemberName === 'name') continue;
                Reflect.defineProperty(fn, staticMemberName, Reflect.getOwnPropertyDescriptor(target, staticMemberName));
            }

            return fn;
        }

        return target;
    } as ClassDecorator;
}
