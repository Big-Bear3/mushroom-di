import type { DiConstants } from '../constants/diConstants';
import type { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';

export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export type ClassTypes<T extends any[]> = T extends [first: infer F, ...rest: infer R] ? [Class<F>, ...ClassTypes<R>] : [];
export type InstanceTypes<T extends Class[]> = T extends [first: infer F extends Class, ...rest: infer R extends Class[]]
    ? [InstanceType<F>, ...InstanceTypes<R>]
    : [];

export type ObjectKey = string | symbol | number;
export type ObjectType = Record<ObjectKey, any>;

export type InjectType = 'multiple' | 'cached' | 'singleton';

export type InjectableBasicOptions<T extends ObjectType = ObjectType> = (
    | {
          type?: Exclude<InjectType, 'cached'>;
      }
    | ({
          type?: Extract<InjectType, 'cached'>;
          follow?: (instance: T) => ObjectType;
      } & ThisType<T>)
) & {
    setTo?: 'inextensible' | 'sealed' | 'frozen';
};

export type InjectableOptions<T extends ObjectType = ObjectType> = InjectableBasicOptions<T> & {
    injectOnNew?: boolean;
};

export interface InjectOptions {
    lazy: boolean;
}

export type ConfigMethod = (
    configEntity: DependencyConfigEntity<any, any[]>,
    outerClass?: Class
) => void | typeof DiConstants.STOP_DEEP_CONFIG | ObjectType;

export type GenericType<T> = T extends Class<infer G> ? G : any;

export interface MethodDescriptor {
    configurable: boolean;
    enumerable: boolean;
    writable: boolean;
    value: Function;
}

export interface DependencyConfigResult<T> {
    usingClass?: NormalClass<T>;
    usingArgs?: any[];
    usingObject?: T;
    afterInstanceCreate?: (instance: T) => void;
    afterInstanceFetch?: (instance: T, isNew: boolean) => void;
}

export type DependencyWeakKey = ObjectType;
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
