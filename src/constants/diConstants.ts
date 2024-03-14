import type { InjectableOptions, InjectOptions } from '../types/diTypes';

export class DiConstants {
    /** 默认可注入对象的被注入选项 */
    static #defaultInjectableOptions: InjectableOptions = {
        type: 'multiple'
    };

    /** 默认注入选项 */
    static #defaultInjectOptions: InjectOptions = {
        lazy: false
    };

    /** 默认可注入对象被注入选项 */
    static get defaultInjectableOptions() {
        DiConstants.defaultConfigAlreadyGot = true;
        return DiConstants.#defaultInjectableOptions;
    }

    /** 默认注入选项 */
    static get defaultInjectOptions() {
        DiConstants.defaultConfigAlreadyGot = true;
        return DiConstants.#defaultInjectOptions;
    }

    /** 是否已经使用过默认配置 */
    static defaultConfigAlreadyGot = false;

    /** 是否已经设置过全局配置 */
    static globalConfigAlreadySet = false;

    /** mushroom-pinia中用于存放原始类的属性键名 */
    static readonly originalClassPropName = '__mp_class';

    /** mushroom-pinia中用于存放原始类实例的属性键名 */
    static readonly originalInstancePropName = '__mp_instance';

    /** mushroom-pinia 在Class Store创建后的回调函数名 */
    static readonly afterClassStoreInstanceCreatedCbName = '__mp_afterClassStoreInstanceCreated';

    /** 自动注入标识，用作of()和by()的参数 */
    static readonly AUTO = Symbol('DI-AUTO');

    /** 停止深度查找依赖配置标识，用于自定义配置依赖方法的返回值 */
    static readonly STOP_DEEP_CONFIG = Symbol('DI-STOP-DEEP-CONFIG');

    /** 值依赖模块标识 */
    static readonly MODULE = Symbol('DI-VALUE-DEPS-MODULE');
}

/** 消息换行 */
export const msgNewLine = '\n    ';
