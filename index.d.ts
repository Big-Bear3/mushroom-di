export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

type InstanceTypes<T extends Class[]> = T extends [first: infer F, ...rest: infer R]
    ? [InstanceType<F>, ...InstanceTypes<R>]
    : [];

export function of<T extends Class>(c: T): InstanceType<T>;
export function of<T extends [Class, ...Class[]]>(...c: T): InstanceTypes<T>;

export function by<T extends Class>(c: T, ...args: ConstructorParameters<T>): InstanceType<T>;
export function by<T extends Class, CP extends [any, ...any[]]>(c: T, ...args: CP): InstanceType<T>;

export const AUTO: any;
export const STOP_DEEP_CONFIG: symbol;

export type InjectorType = 'multiple' | 'singleton';
export interface InjectableOptions {
    type: InjectorType;
}

export function Injectable(options?: InjectableOptions): ClassDecorator;
export function DependencyConfig(c: Class): MethodDecorator;

export type GenericType<T> = T extends Class<infer G> ? G : any;
export interface DependencyConfigEntity<T extends Class = any, A extends Class | any[] = never> {
    usingClass: Class<GenericType<T>>;
    args: ConstructorParameters<T> | (A extends Class ? ConstructorParameters<A> : A);
}
export type ConfigMethod = (configEntity: DependencyConfigEntity<any, any[]>, outerClass?: Class) => void | symbol | any;

export interface DependencyConfigResult<T> {
    usingClass?: Class<T>;
    usingArgs?: any[];
    usingObject?: T;
}
