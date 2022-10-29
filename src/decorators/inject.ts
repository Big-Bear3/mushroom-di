import type { Class, InjectOptions, ObjectKey } from './../types/diTypes';

import { InjectMembersHandler } from '../dependency/injectMembersHandler';
import { DependenciesClassCollector } from '../../src/dependency-config/dependenciesClassCollector';

/**
 * Inject() 装饰器
 */
export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;
export function Inject(classOrInjectOptions?: Class | InjectOptions, injectOptions?: InjectOptions): PropertyDecorator {
    const injectArgumentsLength = arguments.length;

    return function (target: Class, key: ObjectKey) {
        const isStatic = isStaticMember(target);

        if (injectArgumentsLength === 0) {
            isStatic ? addInjectStaticMemberOfDesignType(target, key) : addInjectMemberOfDesignType(target, key);
        } else if (injectArgumentsLength === 1) {
            if (typeof classOrInjectOptions === 'function') {
                isStatic
                    ? addInjectStaticMemberOfSpecificClass(target, key, classOrInjectOptions)
                    : addInjectMemberOfSpecificClass(target, key, classOrInjectOptions);
            } else {
                if (classOrInjectOptions === null || classOrInjectOptions === undefined) {
                    isStatic ? addInjectStaticMemberOfDesignType(target, key) : addInjectMemberOfDesignType(target, key);
                } else {
                    isStatic
                        ? addInjectStaticMemberOfDesignType(target, key, classOrInjectOptions)
                        : addInjectMemberOfDesignType(target, key, classOrInjectOptions);
                }
            }
        } else if (injectArgumentsLength === 2) {
            if (classOrInjectOptions === null || classOrInjectOptions === undefined) {
                isStatic
                    ? addInjectStaticMemberOfDesignType(target, key, injectOptions)
                    : addInjectMemberOfDesignType(target, key, injectOptions);
            } else {
                isStatic
                    ? addInjectStaticMemberOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions)
                    : addInjectMemberOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions);
            }
        }
    } as PropertyDecorator;
}

/** 添加通过metadata获取类型的成员变量 */
function addInjectMemberOfDesignType(target: Class, key: ObjectKey, injectOptions?: InjectOptions): void {
    const designType = Reflect.getMetadata?.('design:type', target, <any>key);
    if (!designType || !DependenciesClassCollector.instance.contains(designType)) return;

    InjectMembersHandler.instance.addInjectMember(target, key, designType, injectOptions);
}

/** 添加指定类型的成员变量 */
function addInjectMemberOfSpecificClass(
    target: Class,
    key: ObjectKey,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    if (!DependenciesClassCollector.instance.contains(specificClass)) return;

    InjectMembersHandler.instance.addInjectMember(target, key, specificClass, injectOptions);
}

/** 添加通过metadata获取类型的静态成员变量 */
function addInjectStaticMemberOfDesignType(target: Class, key: ObjectKey, injectOptions?: InjectOptions): void {
    const designType = Reflect.getMetadata?.('design:type', target, <any>key);
    if (!designType || !DependenciesClassCollector.instance.contains(designType)) return;

    InjectMembersHandler.instance.handleInstanceStaticMember(target, key, designType, injectOptions);
}

/** 添加指定类型的静态成员变量 */
function addInjectStaticMemberOfSpecificClass(
    target: Class,
    key: ObjectKey,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    if (!DependenciesClassCollector.instance.contains(specificClass)) return;

    InjectMembersHandler.instance.handleInstanceStaticMember(target, key, specificClass, injectOptions);
}

/** 判断是否是静态成员变量 */
function isStaticMember(target: Class): boolean {
    return !!target.prototype;
}
