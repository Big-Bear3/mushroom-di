import 'reflect-metadata';

import type { Class, ClassTypes, InstanceTypes } from './types/diTypes';

import { AUTO as autoFlag, STOP_DEEP_CONFIG as stopDeepConfigFlag } from './constants/diConstants';
import { Injectable as InjectableDecorator } from './decorators/injectable';
import { DependencyConfig as DependencyConfigDecorator } from './decorators/dependencyConfig';
import { Inject as InjectDecorator } from './decorators/inject';
import { DependenciesSearcher } from './dependency/dependenciesSearcher';
import { MushroomService as MushroomServiceClass } from './mushroomService';

// import { Message as MessageClass } from './utils/message';

const dependenciesSearcher = DependenciesSearcher.getInstance();

export function of<T extends Class>(c: T): InstanceType<T>;
export function of<T extends [Class, ...Class[]]>(...c: T): InstanceTypes<T>;
export function of<T>(c: Class<T>): T;
export function of<T extends [any, ...any[]]>(...c: ClassTypes<T>): T;
export function of(...classes: Class[]): any | any[] {
    if (classes.length === 1) return dependenciesSearcher.searchDependency(classes[0]);
    return classes.map((c) => dependenciesSearcher.searchDependency(c));
}

export function by<T extends Class>(c: T, ...args: ConstructorParameters<T>): InstanceType<T>;
export function by<T extends Class, CP extends [any, ...any[]]>(c: T, ...args: CP): InstanceType<T>;
export function by<T, CP extends [any, ...any[]]>(c: Class<T>, ...args: CP): T;
export function by<T extends Class>(c: T, ...args: any[]): InstanceType<T> {
    return dependenciesSearcher.searchDependency(c, args);
}

export const Injectable = InjectableDecorator;
export const DependencyConfig = DependencyConfigDecorator;
export const Inject = InjectDecorator;

export const MushroomService = MushroomServiceClass;

export const AUTO = autoFlag;
export const STOP_DEEP_CONFIG = stopDeepConfigFlag;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function registerDepsConfig(c: Class): void {}

of(MushroomService);

// export const Message = MessageClass;

// import('../tests/webTest');
