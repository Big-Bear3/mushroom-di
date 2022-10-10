export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export type ClassTypes<T extends any[]> = T extends [first: infer F, ...rest: infer R] ? [Class<F>, ...ClassTypes<R>] : [];
export type InstanceTypes<T extends Class[]> = T extends [first: infer F, ...rest: infer R]
    ? [InstanceType<F extends Class ? F : any>, ...InstanceTypes<R extends Class[] ? R : any[]>]
    : [];

export type GenericType<T> = T extends Class<infer G> ? G : any;

export type InjectType = 'multiple' | 'singleton';

export interface InjectableOptions {
    type: InjectType;
}

export interface InjectOptions {
    lazy: boolean;
}

export interface DependencyConfigEntity<T extends Class = any, A extends Class | any[] | undefined = undefined> {
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

export function Injectable(options?: InjectableOptions): ClassDecorator;

export function DependencyConfig(c: Class): MethodDecorator;

export function Inject(): PropertyDecorator;
export function Inject(c: Class): PropertyDecorator;
export function Inject(injectOptions: InjectOptions): PropertyDecorator;
export function Inject(c: Class, injectOptions: InjectOptions): PropertyDecorator;

export class MushroomService {
    destroySingletonInstance(nc: NormalClass): void;
}

export const AUTO: any;
export const STOP_DEEP_CONFIG: symbol;

export function registerDepsConfig(c: Class): void;
