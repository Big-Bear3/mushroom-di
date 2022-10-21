import type { Class } from '../types/diTypes';

import { Message } from '../utils/message';
import { ValueDependenciesManager } from '../dependency/valueDependenciesManager';

/**
 * InjectVal() 装饰器
 */
export function InjectVal(key: string, defaultValue?: unknown): PropertyDecorator {
    if (typeof key !== 'string') Message.throwError('29013', 'key必须是string类型！');

    const hasDefaultValue = arguments.length === 2;

    return function (target: Class, memberName: string | symbol) {
        Reflect.defineProperty(target, memberName, {
            enumerable: true,
            configurable: true,
            get() {
                const valueDependenciesManager = ValueDependenciesManager.getInstance();
                const value = valueDependenciesManager.takeValue(key);

                if ((value === null || value === undefined) && hasDefaultValue) return defaultValue;

                return value;
            },
            set() {
                Message.error('21002', '被InjectVal()装饰器装饰的属性为只读属性，无法赋值！');
            }
        });
    } as PropertyDecorator;
}
