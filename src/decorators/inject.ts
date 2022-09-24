import type { Class, InjectOptions } from './../types/diTypes';

import { InjectPropertiesHandler } from './../dependency/injectPropertiesHandler';

export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;
export function Inject(classOrInjectOptions?: Class | InjectOptions, injectOptions?: InjectOptions): PropertyDecorator {
    const injectArgumentsLength = arguments.length;

    return function (target: any, key: string | symbol) {
        if (injectArgumentsLength === 0) {
            addInjectPropertyOfDesignType(target, key);
        } else if (injectArgumentsLength === 1) {
            if (typeof classOrInjectOptions === 'function') {
                addInjectPropertyOfSpecificClass(target, key, classOrInjectOptions);
            } else {
                addInjectPropertyOfDesignType(target, key, classOrInjectOptions);
            }
        } else if (injectArgumentsLength === 2) {
            addInjectPropertyOfSpecificClass(target, key, <Class>classOrInjectOptions, injectOptions);
        }
    };
}

function addInjectPropertyOfDesignType(target: any, key: string | symbol, injectOptions?: InjectOptions): void {
    const designType = Reflect.getMetadata('design:type', target, key);
    if (!designType || designType === Object) return;

    InjectPropertiesHandler.getInstance().addInjectProperty(target, key, designType, injectOptions);
}

function addInjectPropertyOfSpecificClass(
    target: any,
    key: string | symbol,
    specificClass: Class,
    injectOptions?: InjectOptions
): void {
    if (!specificClass || specificClass === Object) return;
    InjectPropertiesHandler.getInstance().addInjectProperty(target, key, specificClass, injectOptions);
}
