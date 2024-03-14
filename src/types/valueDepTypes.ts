import type { DiConstants } from '../constants/diConstants';
import type { ObjectType } from './diTypes';

export type Module = typeof DiConstants.MODULE;

/** 模块化的值的类型 */
export type ModularValues = {
    [DiConstants.MODULE]: Record<string, ObjectType & Partial<ModularValues>>;
};

/** 取所有key序列，直到最后连续两层都是字符串 */
type DeepKeys<T extends Record<string | symbol, any>, LastIsSymbol extends boolean = false> =
    T extends Record<string | symbol, any>
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

/** 筛选出最后两层都是字符串的key序列 */
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

/** 去掉Module元素 */
type DeepValidKeysWithoutModule<T> = T extends [infer F, ...infer R]
    ? F extends symbol
        ? [...DeepValidKeysWithoutModule<R>]
        : [F, ...DeepValidKeysWithoutModule<R>]
    : [];

/** 数组转字符串，通过分隔符分隔 */
type ArrayJoin<T extends string[], U extends string = '.'> = T extends [infer F extends string, ...infer R extends string[]]
    ? R['length'] extends 0
        ? F
        : `${F}${U}${ArrayJoin<R, U>}`
    : never;

/** 根据key序列取值类型 */
type DeepValue<T extends Record<string | symbol, any>, U extends (string | symbol)[]> = U extends [infer F, ...infer R]
    ? F extends keyof T
        ? R['length'] extends 0
            ? T[F]
            : R extends (string | symbol)[]
              ? DeepValue<T[F], R>
              : never
        : never
    : never;

/** {key序列: 对应值类型} */
export type ModularKeysObject<T extends Record<string | symbol, any>> = {
    [P in DeepValidKeys<T> as P extends (string | symbol)[] ? ArrayJoin<DeepValidKeysWithoutModule<P>> : never]: P extends (
        | string
        | symbol
    )[]
        ? DeepValue<T, P>
        : never;
};

/** key序列元组转对应的值类型元组 */
export type ModularKeysTupleToObjects<U extends ModularKeysObject<ModularValues>, K = [keyof U, ...(keyof U)[]]> = K extends [
    first: infer F,
    ...rest: infer R
]
    ? F extends keyof U
        ? [U[F], ...ModularKeysTupleToObjects<U, R>]
        : never
    : [];
