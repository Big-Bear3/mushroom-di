import type { InjectableOptions } from '../types/diTypes';
import type { InjectOptions } from './../types/diTypes';

/** 默认可注入对象被注入选项 */
export const defaultInjectableOptions: InjectableOptions = {
    type: 'multiple'
};

/** 默认注入选项 */
export const defaultInjectOptions: InjectOptions = {
    lazy: false
};

/** 消息换行标识符 */
export const messageNewLineSign = '\n    ';

/** 自动注入标识，用作of()和by()的参数 */
export const AUTO = Symbol('DI-AUTO');

/** 停止深度查找依赖配置标识，用于自定义配置依赖方法的返回值 */
export const STOP_DEEP_CONFIG = Symbol('DI-STOP-DEEP-CONFIG');
