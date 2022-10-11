import type { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';

export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export type ClassTypes<T extends any[]> = T extends [first: infer F, ...rest: infer R] ? [Class<F>, ...ClassTypes<R>] : [];
export type InstanceTypes<T extends Class[]> = T extends [first: infer F, ...rest: infer R]
    ? [InstanceType<F extends Class ? F : any>, ...InstanceTypes<R extends Class[] ? R : any[]>]
    : [];

export type InjectType = 'multiple' | 'cached' | 'singleton';

export interface InjectableOptions {
    type: InjectType;
}

export interface InjectOptions {
    lazy: boolean;
}

export type ConfigMethod = (configEntity: DependencyConfigEntity<any, any[]>, outerClass?: Class) => void | symbol | any;

export type GenericType<T> = T extends Class<infer G> ? G : any;

export interface MethodDescriptor {
    configurable: boolean;
    enumerable: boolean;
    writable: boolean;
    value: Function;
}

export interface DependencyConfigResult<T> {
    usingClass?: Class<T>;
    usingArgs?: any[];
    usingObject?: T;
    afterInstanceCreate?: (instance: T) => void;
    afterInstanceFetch?: (instance: T, isNew: boolean) => void;
}

export type DependencyWeakKey = Record<string | symbol | number, any>;
export type DependencyKey =
    | string
    | symbol
    | number
    | boolean
    | bigint
    | ((...args: any[]) => any)
    | Class
    | null
    | undefined
    | DependencyWeakKey;
