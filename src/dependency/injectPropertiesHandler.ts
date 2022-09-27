import type { Class, NormalClass } from '../../src/types/diTypes';
import type { InjectOptions } from './../types/diTypes';

import { defaultInjectOptions } from './../constants/diConstants';
import { DependenciesSearcher } from './dependenciesSearcher';

interface InjectPropertiesInfo {
    props: {
        propName: string | symbol;
        definedClass: Class;
    }[];
    lazyProps: {
        propName: string | symbol;
        definedClass: Class;
    }[];
    lazyPropsHandled: boolean;
}

/** 用于处理静态、非静态成员变量注入 */
export class InjectPropertiesHandler {
    private static instance: InjectPropertiesHandler;

    private classToInjectProperties = new WeakMap<Class, InjectPropertiesInfo>();

    private instanceToLazyInjectProperties = new WeakMap<any, Record<string | symbol, any>>();

    addInjectProperty(
        c: Class,
        propName: string | symbol,
        definedClass: Class,
        injectOptions: InjectOptions = defaultInjectOptions
    ): void {
        const targetInjectPropertiesInfo = this.classToInjectProperties.get(c);

        if (targetInjectPropertiesInfo) {
            if (injectOptions.lazy)
                targetInjectPropertiesInfo.lazyProps.push({
                    propName,
                    definedClass
                });
            else
                targetInjectPropertiesInfo.props.push({
                    propName,
                    definedClass
                });
        } else {
            if (injectOptions.lazy)
                this.classToInjectProperties.set(c, {
                    props: [],
                    lazyProps: [
                        {
                            propName,
                            definedClass
                        }
                    ],
                    lazyPropsHandled: false
                });
            else
                this.classToInjectProperties.set(c, {
                    props: [
                        {
                            propName,
                            definedClass
                        }
                    ],
                    lazyProps: [],
                    lazyPropsHandled: false
                });
        }
    }

    handleInstanceProperties(nc: NormalClass, instance: Record<string | symbol, any>): void {
        const injectPropertiesInfo = this.classToInjectProperties.get(nc.prototype);
        if (injectPropertiesInfo) {
            const dependenciesSearcher = DependenciesSearcher.getInstance();

            for (const propInfo of injectPropertiesInfo.props) {
                instance[propInfo.propName] = propInfo.definedClass
                    ? dependenciesSearcher.searchDependency(propInfo.definedClass)
                    : undefined;
            }
        }

        const parentClass = Object.getPrototypeOf(nc);
        if (parentClass) {
            this.handleInstanceProperties(parentClass, instance);
        }
    }

    handleInstanceLazyProperties(nc: NormalClass): void {
        const injectPropertiesInfo = this.classToInjectProperties.get(nc.prototype);
        if (injectPropertiesInfo && !injectPropertiesInfo.lazyPropsHandled) {
            const dependenciesSearcher = DependenciesSearcher.getInstance();
            const instanceToLazyInjectProperties = this.instanceToLazyInjectProperties;

            for (const propInfo of injectPropertiesInfo.lazyProps) {
                if (propInfo.definedClass) {
                    Reflect.defineProperty(nc.prototype, propInfo.propName, {
                        enumerable: true,
                        configurable: true,
                        get() {
                            let properties = instanceToLazyInjectProperties.get(this);
                            if (properties) {
                                if (Reflect.has(properties, propInfo.propName)) return properties[propInfo.propName];
                            } else {
                                properties = {};
                                instanceToLazyInjectProperties.set(this, properties);
                            }
                            const propValue = dependenciesSearcher.searchDependency(propInfo.definedClass);
                            properties[propInfo.propName] = propValue;
                            return propValue;
                        },
                        set(value: unknown) {
                            let properties = instanceToLazyInjectProperties.get(this);
                            if (!properties) {
                                properties = {};
                                instanceToLazyInjectProperties.set(this, properties);
                            }
                            properties[propInfo.propName] = value;
                        }
                    });
                } else {
                    Reflect.set(nc.prototype, propInfo.propName, undefined);
                }
            }
        }

        const parentClass = Object.getPrototypeOf(nc);
        if (parentClass) {
            this.handleInstanceLazyProperties(parentClass);
        }
    }

    handleInstanceStaticProperty(
        c: Class,
        propName: string | symbol,
        definedClass: Class,
        injectOptions: InjectOptions = defaultInjectOptions
    ): void {
        if (injectOptions.lazy && definedClass) {
            let _value: any;

            Reflect.defineProperty(c, propName, {
                enumerable: true,
                configurable: true,
                get() {
                    if (_value) return _value;

                    _value = DependenciesSearcher.getInstance().searchDependency(definedClass);
                    return _value;
                },
                set(value: unknown) {
                    _value = value;
                }
            });
        } else {
            if (definedClass) Reflect.set(c, propName, DependenciesSearcher.getInstance().searchDependency(definedClass));
            else Reflect.set(c, propName, undefined);
        }
    }

    static getInstance(): InjectPropertiesHandler {
        if (!InjectPropertiesHandler.instance) {
            InjectPropertiesHandler.instance = new InjectPropertiesHandler();
        }
        return InjectPropertiesHandler.instance;
    }
}
