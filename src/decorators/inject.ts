import type { Class, InjectOptions } from './../types/diTypes';

import { InjectPropertiesHandler } from './../dependency/injectPropertiesHandler';

export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;
export function Inject(classOrInjectOptions?: Class | InjectOptions, injectOptions?: InjectOptions): PropertyDecorator {
    const injectArgumentsLength = arguments.length;

    return function (target: any, key: string | symbol) {
        const isStaticProp = isStaticProperty(target);

        if (injectArgumentsLength === 0) {
            isStaticProp ? addInjectStaticPropertyOfDesignType(target, key) : addInjectPropertyOfDesignType(target, key);
        } else if (injectArgumentsLength === 1) {
            if (typeof classOrInjectOptions === 'function') {
                isStaticProp
                    ? addInjectStaticPropertyOfSpecificClass(target, key, classOrInjectOptions)
                    : addInjectPropertyOfSpecificClass(target, key, classOrInjectOptions);
            } else {
                isStaticProp
                    ? addInjectStaticPropertyOfDesignType(target, key, classOrInjectOptions)
                    : addInjectPropertyOfDesignType(target, key, classOrInjectOptions);
            }
        } else if (injectArgumentsLength === 2) {
            isStaticProp
                ? addInjectStaticPropertyOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions)
                : addInjectPropertyOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions);
        }
    };
}

function addInjectPropertyOfDesignType(target: any, key: string | symbol, injectOptions?: InjectOptions): void {
    let designType = Reflect.getMetadata?.('design:type', target, key);
    if (!designType || designType === Object) designType = undefined;

    InjectPropertiesHandler.getInstance().addInjectProperty(target, key, designType, injectOptions);
}

function addInjectPropertyOfSpecificClass(
    target: any,
    key: string | symbol,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    let designType = specificClass;
    if (!specificClass || specificClass === Object) designType = undefined;

    InjectPropertiesHandler.getInstance().addInjectProperty(target, key, designType, injectOptions);
}

function addInjectStaticPropertyOfDesignType(target: any, key: string | symbol, injectOptions?: InjectOptions): void {
    let designType = Reflect.getMetadata?.('design:type', target, key);
    if (!designType || designType === Object) designType = undefined;

    InjectPropertiesHandler.getInstance().handleInstanceStaticProperty(target, key, designType, injectOptions);
}

function addInjectStaticPropertyOfSpecificClass(
    target: any,
    key: string | symbol,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    let designType = specificClass;
    if (!specificClass || specificClass === Object) designType = undefined;

    InjectPropertiesHandler.getInstance().handleInstanceStaticProperty(target, key, designType, injectOptions);
}

function isStaticProperty(target: any): boolean {
    return !!target.prototype;
}
