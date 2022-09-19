import 'reflect-metadata';
import { diAuto, stopDeepConfig as stopDeepConfigFlag } from './constants/diConstants';
import { Injectable as InjectableDecorator } from './decorators/injectable';
import { DependencyConfig as DependencyConfigDecorator } from './decorators/dependencyConfig';
import { DependenciesSearcher } from './dependency/dependenciesSearcher';
import { Message } from './utils/message';
import { SingletonDependenciesManager } from './dependency-manager/singletonDependenciesManager';

const dependenciesSearcher = DependenciesSearcher.getInstance();

function of(...classes: Class[]): any | any[] {
    if (classes.length === 1) return dependenciesSearcher.searchDependency(classes[0]);
    return classes.map((c) => dependenciesSearcher.searchDependency(c));
}

function by<T extends Class>(c: T, ...args: any[]): InstanceType<T> {
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

export const stopDeepConfig = stopDeepConfigFlag;

if (Reflect.has(window, 'of')) {
    Message.error('01001', '依赖注入容器初始化失败！');
    Message.throwError('09001', '依赖注入全局方法 "of" 被占用！');
} else if (Reflect.has(window, 'by')) {
    Message.error('01002', '依赖注入容器初始化失败！');
    Message.throwError('09002', '依赖注入全局方法 "by" 被占用！');
} else if (Reflect.has(window, 'AUTO')) {
    Message.error('01003', '依赖注入容器初始化失败！');
    Message.throwError('09003', '依赖注入全局属性 "AUTO" 被占用！');
} else if (Reflect.has(window, 'destroySingletonInstance')) {
    Message.error('01004', '依赖注入容器初始化失败！');
    Message.throwError('09004', '依赖注入全局方法 "destroySingletonInstance" 被占用！');
} else if (Reflect.has(window, 'destroySingletonInstance')) {
    Message.error('01005', '依赖注入容器初始化失败！');
    Message.throwError('09005', '依赖注入全局方法 "registerDepsConfig" 被占用！');
} else {
    const windowAny: any = window;
    windowAny.of = of;
    windowAny.by = by;
    windowAny.AUTO = diAuto;
}

// import('../tests/webTest');
