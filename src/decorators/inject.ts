import type { Class, InjectOptions, ObjectKey } from './../types/diTypes';

import { InjectMembersHandler } from '../dependency/injectMembersHandler';
import { DependenciesClassCollector } from '../dependency-config/dependenciesClassCollector';

/**
 * Inject() 装饰器
 * 用于装饰成员变量以注入依赖
 */
export function Inject(): PropertyDecorator;
export function Inject(cs: Class | symbol): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(cs: Class | symbol, injectOptions: InjectOptions): PropertyDecorator;
export function Inject(
    classOrSymbolOrInjectOptions?: Class | symbol | InjectOptions,
    injectOptions?: InjectOptions
): PropertyDecorator {
    const injectArgumentsLength = arguments.length;

    return function (target: Class, key: ObjectKey) {
        const isStatic = isStaticMember(target);

        if (injectArgumentsLength === 0) {
            isStatic ? addInjectStaticMemberOfDesignType(target, key) : addInjectMemberOfDesignType(target, key);
        } else if (injectArgumentsLength === 1) {
            if (typeof classOrSymbolOrInjectOptions === 'function' || typeof classOrSymbolOrInjectOptions === 'symbol') {
                isStatic
                    ? addInjectStaticMemberOfSpecificClassOrSymbol(target, key, classOrSymbolOrInjectOptions)
                    : addInjectMemberOfSpecificClassOrSymbol(target, key, classOrSymbolOrInjectOptions);
            } else {
                if (classOrSymbolOrInjectOptions === null || classOrSymbolOrInjectOptions === undefined) {
                    isStatic ? addInjectStaticMemberOfDesignType(target, key) : addInjectMemberOfDesignType(target, key);
                } else {
                    isStatic
                        ? addInjectStaticMemberOfDesignType(target, key, classOrSymbolOrInjectOptions)
                        : addInjectMemberOfDesignType(target, key, classOrSymbolOrInjectOptions);
                }
            }
        } else if (injectArgumentsLength === 2) {
            if (classOrSymbolOrInjectOptions === null || classOrSymbolOrInjectOptions === undefined) {
                isStatic
                    ? addInjectStaticMemberOfDesignType(target, key, injectOptions)
                    : addInjectMemberOfDesignType(target, key, injectOptions);
            } else {
                isStatic
                    ? addInjectStaticMemberOfSpecificClassOrSymbol(
                          target,
                          key,
                          <Class | symbol>classOrSymbolOrInjectOptions,
                          injectOptions
                      )
                    : addInjectMemberOfSpecificClassOrSymbol(
                          target,
                          key,
                          <Class | symbol>classOrSymbolOrInjectOptions,
                          injectOptions
                      );
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
function addInjectMemberOfSpecificClassOrSymbol(
    target: Class,
    key: ObjectKey,
    specificClassOrSymbol: Class | symbol,
    injectOptions?: InjectOptions
): void {
    if (typeof specificClassOrSymbol === 'function' && !DependenciesClassCollector.instance.contains(specificClassOrSymbol))
        return;

    InjectMembersHandler.instance.addInjectMember(target, key, specificClassOrSymbol, injectOptions);
}

/** 添加通过metadata获取类型的静态成员变量 */
function addInjectStaticMemberOfDesignType(target: Class, key: ObjectKey, injectOptions?: InjectOptions): void {
    const designType = Reflect.getMetadata?.('design:type', target, <any>key);
    if (!designType || !DependenciesClassCollector.instance.contains(designType)) return;

    InjectMembersHandler.instance.handleInstanceStaticMember(target, key, designType, injectOptions);
}

/** 添加指定类型的静态成员变量 */
function addInjectStaticMemberOfSpecificClassOrSymbol(
    target: Class,
    key: ObjectKey,
    specificClassOrSymbol: Class | symbol,
    injectOptions?: InjectOptions
): void {
    if (typeof specificClassOrSymbol === 'function' && !DependenciesClassCollector.instance.contains(specificClassOrSymbol))
        return;

    InjectMembersHandler.instance.handleInstanceStaticMember(target, key, specificClassOrSymbol, injectOptions);
}

/** 判断是否是静态成员变量 */
function isStaticMember(target: Class): boolean {
    return !!target.prototype;
}
