import 'reflect-metadata';

import type { Class, NormalClass } from './types/diTypes';

import { AUTO as autoFlag, STOP_DEEP_CONFIG as stopDeepConfigFlag } from './constants/diConstants';
import { Injectable as InjectableDecorator } from './decorators/injectable';
import { DependencyConfig as DependencyConfigDecorator } from './decorators/dependencyConfig';
import { DependenciesSearcher } from './dependency/dependenciesSearcher';
import { SingletonDependenciesManager } from './dependency-manager/singletonDependenciesManager';

const dependenciesSearcher = DependenciesSearcher.getInstance();

export function of(...classes: Class[]): any | any[] {
    if (classes.length === 1) return dependenciesSearcher.searchDependency(classes[0]);
    return classes.map((c) => dependenciesSearcher.searchDependency(c));
}

export function by<T extends Class>(c: T, ...args: any[]): InstanceType<T> {
    return dependenciesSearcher.searchDependency(c, args);
}

export function destroySingletonInstance(nc: NormalClass): void {
    const singletonDependenciesManager = SingletonDependenciesManager.getInstance();
    singletonDependenciesManager.removeDependency(nc);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function registerDepsConfig(c: Class): void {}

export const Injectable = InjectableDecorator;
export const DependencyConfig = DependencyConfigDecorator;

export const AUTO = autoFlag;
export const STOP_DEEP_CONFIG = stopDeepConfigFlag;

// import('../tests/webTest');
