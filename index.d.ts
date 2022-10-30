export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export type ClassTypes<T extends any[]> = T extends [first: infer F, ...rest: infer R] ? [Class<F>, ...ClassTypes<R>] : [];
export type InstanceTypes<T extends Class[]> = T extends [first: infer F, ...rest: infer R]
    ? [InstanceType<F extends Class ? F : any>, ...InstanceTypes<R extends Class[] ? R : any[]>]
    : [];

export type ObjectKey = string | symbol | number;
export type ObjectType = Record<ObjectKey, any>;

export type GenericType<T> = T extends Class<infer G> ? G : any;

export type InjectType = 'multiple' | 'cached' | 'singleton';

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

export type InjectableOptions<T extends ObjectType = ObjectType> = (
    | {
          type?: Exclude<InjectType, 'cached'>;
      }
    | ({
          type?: Extract<InjectType, 'cached'>;
          follow?: (instance: T) => ObjectType;
      } & ThisType<T>)
) & {
    setTo?: 'sealed' | 'frozen';
};

export interface InjectOptions {
    lazy: boolean;
}

export interface DependencyConfigEntity<T extends Class = Class, A extends Class | any[] | undefined = undefined> {
    usingClass: Class<GenericType<T>>;
    args: A extends undefined ? ConstructorParameters<T> : A extends Class ? ConstructorParameters<A> : A;
    afterInstanceCreate?: (instance: InstanceType<T>) => void;
    afterInstanceFetch?: (instance: InstanceType<T>, isNew: boolean) => void;
}

export function of<T extends Class>(c: T): InstanceType<T>;
export function of<T extends [Class, ...Class[]]>(...c: T): InstanceTypes<T>;
export function of<T>(c: Class<T>): T;
export function of<T extends [any, ...any[]]>(...c: ClassTypes<T>): T;

export function by<T extends Class>(c: T, ...args: ConstructorParameters<T>): InstanceType<T>;
export function by<T extends Class, CP extends [any, ...any[]]>(c: T, ...args: CP): InstanceType<T>;
export function by<T, CP extends [any, ...any[]]>(c: Class<T>, ...args: CP): T;

export function Injectable<T extends ObjectType>(options?: InjectableOptions<T>): ClassDecorator;

export function DependencyConfig(c: Class): MethodDecorator;

export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;

export class MushroomService {
    addDependencyWithKey<T>(nc: NormalClass<T>, instance: T, key: DependencyKey): void;
    addDependencyWithWeakKey<T>(nc: NormalClass<T>, instance: T, key: DependencyWeakKey): void;
    getDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): T;
    containsDependencyWithKey<T>(nc: NormalClass<T>, key: DependencyKey): boolean;
    removeDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): boolean;
    destroyCachedInstance(nc: NormalClass): boolean;
    destroySingletonInstance(nc: NormalClass): boolean;
    buildValueDepsManager<T extends ModularValues>(
        values?: T
    ): {
        patchVal<U extends ModularKeysObject<T>, K extends keyof U>(key: K, value: U[K]): void;
        patchVal<U extends ModularKeysObject<T>, K extends keyof U>(keyValuePairs: {
            [P in K]: U[P];
        }): void;
        takeVal<U extends ModularKeysObject<T>, K extends keyof U>(key: K): U[K];
        takeVal<U extends ModularKeysObject<T>, K extends [keyof U, ...(keyof U)[]]>(...key: K): ModularKeysTupleToObjects<U, K>;
        InjectVal<U extends ModularKeysObject<T>, K extends keyof U>(key: K, defaultValue?: U[K]): PropertyDecorator;
    };
}

export const AUTO: any;
export const STOP_DEEP_CONFIG: unique symbol;

export function registerDepsConfig(c: Class): void;

export const MODULE: unique symbol;

export type ModularValues = {
    [MODULE]: Record<string, ObjectType & Partial<ModularValues>>;
};

type DeepKeys<T extends Record<string | symbol, any>, LastIsSymbol extends boolean = false> = T extends Record<
    string | symbol,
    any
>
    ? {
          [K in keyof T]: K extends string
              ? LastIsSymbol extends true
                  ? [K]
                  : [K] | [K, ...DeepKeys<T[K], true>]
              : K extends symbol
              ? [K] | [K, ...DeepKeys<T[K], false>]
              : never;
      }[keyof T]
    : never;

type DeepValidKeys<T extends Record<string | symbol, any>, U extends DeepKeys<T> = DeepKeys<T>> = U extends [
    ...any[],
    infer S,
    infer F
]
    ? F extends string
        ? S extends string
            ? U
            : never
        : never
    : never;

type DeepValidKeysWithoutModule<T> = T extends [infer F, ...infer R]
    ? F extends symbol
        ? [...DeepValidKeysWithoutModule<R>]
        : [F, ...DeepValidKeysWithoutModule<R>]
    : [];

type ArrayJoin<T extends string[], U extends string = '.'> = T extends [infer F, ...infer R]
    ? F extends string
        ? R extends string[]
            ? R['length'] extends 0
                ? F
                : `${F}${U}${ArrayJoin<R, U>}`
            : never
        : never
    : never;

type DeepValue<T extends Record<string | symbol, any>, U extends (string | symbol)[]> = U extends [infer F, ...infer R]
    ? F extends keyof T
        ? R['length'] extends 0
            ? T[F]
            : R extends (string | symbol)[]
            ? DeepValue<T[F], R>
            : never
        : never
    : never;

type ModularKeysObject<T extends Record<string | symbol, any>> = {
    [P in DeepValidKeys<T> as P extends (string | symbol)[] ? ArrayJoin<DeepValidKeysWithoutModule<P>> : never]: P extends (
        | string
        | symbol
    )[]
        ? DeepValue<T, P>
        : never;
};

type ModularKeysTupleToObjects<U extends ModularKeysObject<ModularValues>, K = [keyof U, ...(keyof U)[]]> = K extends [
    first: infer F,
    ...rest: infer R
]
    ? F extends keyof U
        ? [U[F], ...ModularKeysTupleToObjects<U, R>]
        : never
    : [];
