import type { Class, InjectOptions } from './../types/diTypes';

import { InjectMembersHandler } from '../dependency/injectMembersHandler';

/**
 * Inject() 装饰器
 */
export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;
export function Inject(classOrInjectOptions?: Class | InjectOptions, injectOptions?: InjectOptions): PropertyDecorator {
    const injectArgumentsLength = arguments.length;

    return function (target: any, key: string | symbol) {
        const isStatic = isStaticMember(target);

        if (injectArgumentsLength === 0) {
            isStatic ? addInjectStaticMemberOfDesignType(target, key) : addInjectMemberOfDesignType(target, key);
        } else if (injectArgumentsLength === 1) {
            if (typeof classOrInjectOptions === 'function') {
                isStatic
                    ? addInjectStaticMemberOfSpecificClass(target, key, classOrInjectOptions)
                    : addInjectMemberOfSpecificClass(target, key, classOrInjectOptions);
            } else {
                isStatic
                    ? addInjectStaticMemberOfDesignType(target, key, classOrInjectOptions)
                    : addInjectMemberOfDesignType(target, key, classOrInjectOptions);
            }
        } else if (injectArgumentsLength === 2) {
            isStatic
                ? addInjectStaticMemberOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions)
                : addInjectMemberOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions);
        }
    };
}

/** 添加通过metadata获取类型的成员变量 */
function addInjectMemberOfDesignType(target: any, key: string | symbol, injectOptions?: InjectOptions): void {
    let designType = Reflect.getMetadata?.('design:type', target, key);
    if (!designType || designType === Object) designType = undefined;

    InjectMembersHandler.getInstance().addInjectMember(target, key, designType, injectOptions);
}

/** 添加指定类型的成员变量 */
function addInjectMemberOfSpecificClass(
    target: any,
    key: string | symbol,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    let designType = specificClass;
    if (!specificClass || specificClass === Object) designType = undefined;

    InjectMembersHandler.getInstance().addInjectMember(target, key, designType, injectOptions);
}

/** 添加通过metadata获取类型的静态成员变量 */
function addInjectStaticMemberOfDesignType(target: any, key: string | symbol, injectOptions?: InjectOptions): void {
    let designType = Reflect.getMetadata?.('design:type', target, key);
    if (!designType || designType === Object) designType = undefined;

    InjectMembersHandler.getInstance().handleInstanceStaticMember(target, key, designType, injectOptions);
}

/** 添加指定类型的静态成员变量 */
function addInjectStaticMemberOfSpecificClass(
    target: any,
    key: string | symbol,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    let designType = specificClass;
    if (!specificClass || specificClass === Object) designType = undefined;

    InjectMembersHandler.getInstance().handleInstanceStaticMember(target, key, designType, injectOptions);
}

/** 判断是否是静态成员变量 */
function isStaticMember(target: any): boolean {
    return !!target.prototype;
}
