declare type Class<T = any> = abstract new (...args: any[]) => T;
declare type NormalClass<T = any> = new (...args: any[]) => T;

type InstanceTypes<T extends Class[]> = T extends [first: infer F, ...rest: infer R]
    ? [InstanceType<F>, ...InstanceTypes<R>]
    : [];

declare function of<T extends Class>(c: T): InstanceType<T>;
declare function of<T extends [Class, ...Class[]]>(...c: T): InstanceTypes<T>;

declare function by<T extends Class>(c: T, ...args: ConstructorParameters<T>): InstanceType<T>;
declare function by<T extends Class, CP extends [any, ...any[]]>(c: T, ...args: CP): InstanceType<T>;

declare const AUTO: any;
