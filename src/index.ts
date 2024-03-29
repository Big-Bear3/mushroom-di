import 'reflect-metadata';

import type {
    Class,
    ClassTypes,
    ConfigMethod,
    InjectableBasicOptions,
    InjectableOptions,
    InstanceTypes,
    ObjectType
} from './types/diTypes';

import { DiConstants } from './constants/diConstants';
import { Injectable as InjectableDecorator } from './decorators/injectable';
import { DependencyConfig as DependencyConfigDecorator } from './decorators/dependencyConfig';
import { Inject as InjectDecorator } from './decorators/inject';
import { DependenciesSearcher } from './dependency/dependenciesSearcher';
import { MushroomService as MushroomServiceClass } from './mushroomService';

// import { Message as MessageClass } from './utils/message';

const dependenciesSearcher = DependenciesSearcher.instance;

export function of<T extends Class>(c: T): InstanceType<T>;
export function of<T extends [Class, ...Class[]]>(...c: T): InstanceTypes<T>;
export function of<T>(c: Class<T>): T;
export function of<T extends [any, ...any[]]>(...c: ClassTypes<T>): T;
export function of(...classes: Class[]): any | any[] {
    if (classes.length === 1) return dependenciesSearcher.searchDependencyByClass(classes[0]);
    return classes.map((c) => dependenciesSearcher.searchDependencyByClass(c));
}

export function by<T extends Class>(c: T, ...args: ConstructorParameters<T>): InstanceType<T>;
export function by<T extends Class, CP extends [any, ...any[]]>(c: T, ...args: CP): InstanceType<T>;
export function by<T, CP extends [any, ...any[]]>(c: Class<T>, ...args: CP): T;
export function by<T extends Class>(c: T, ...args: any[]): InstanceType<T> {
    return dependenciesSearcher.searchDependencyByClass(c, args);
}

export function req<T>(s: symbol, ...args: any[]): T;
export function req<T, CP extends any[]>(s: symbol, ...args: CP): T;
export function req<T, CPC extends Class>(s: symbol, ...args: ConstructorParameters<CPC>): T;
export function req<T>(s: symbol, ...args: any[]): T {
    return dependenciesSearcher.searchDependencyBySymbol(s, args);
}

export function setAsInjectable<T extends ObjectType>(c: Class<T>, options?: InjectableBasicOptions): void {
    if (options) delete (<InjectableOptions>options).injectOnNew;
    Injectable(options)(c);
}

export function setAsDependencyConfig<T extends ObjectType>(cs: Class<T> | symbol, configMethod: ConfigMethod): void {
    DependencyConfig(cs)(null, null, { value: configMethod });
}

export const Injectable = InjectableDecorator;
export const DependencyConfig = DependencyConfigDecorator;
export const Inject = InjectDecorator;

export const MushroomService = MushroomServiceClass;

export const AUTO = DiConstants.AUTO;
export const STOP_DEEP_CONFIG = DiConstants.STOP_DEEP_CONFIG;

export const MODULE = DiConstants.MODULE;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function registerDepsConfig(c: Class): void {}

of(MushroomService);

// export const Message = MessageClass;

// 用浏览器调试时打开
// import('../tests/webTest');
