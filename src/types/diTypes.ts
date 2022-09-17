import { DependencyConfigEntity } from '../dependency-config/dependencyConfigEntity';

export type InjectorType = 'multiple' | 'singleton';

export interface InjectableOptions {
    type: InjectorType;
}

export type ConfigMethod = (configEntity: DependencyConfigEntity<any, any[]>) => void | symbol | any;

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
