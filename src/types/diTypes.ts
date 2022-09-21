import type { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';

export type Class<T = any> = abstract new (...args: any[]) => T;
export type NormalClass<T = any> = new (...args: any[]) => T;

export type InjectorType = 'multiple' | 'singleton';

export interface InjectableOptions {
    type: InjectorType;
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
}
