import { diAuto, stopDeepConfig as stopDeepConfigFlag } from './constants/diConstants';
import { Injectable as InjectableDecorator } from './decorators/injectable';
import { DependencyConfig as DependencyConfigDecorator } from './decorators/dependencyConfig';
import { DependenciesCreator } from './dependency/dependenciesCreator';
import { InjectorFactory } from './injectors/injectorFactory';
import { SingletonInjector } from './injectors/singletonInjector';
import { Message } from './utils/message';

function of(...classes: Class[]): any | any[] {
    const dependenciesCreator = DependenciesCreator.getInstance();
    if (classes.length === 1) return dependenciesCreator.createInstance(classes[0]);
    return classes.map((c) => dependenciesCreator.createInstance(c));
}

function by<T extends Class>(c: T, ...args: any[]): InstanceType<T> {
    return DependenciesCreator.getInstance().createInstance(c, args);
}

export function destroySingletonInstance(c: NormalClass): void {
    const singletonInjector = <SingletonInjector>InjectorFactory.getInjector('singleton');
    singletonInjector.destroyInstance(c);
}

export function registerDepsConfig(c: NormalClass): void {}

export const Injectable = InjectableDecorator;
export const DependencyConfig = DependencyConfigDecorator;

export const stopDeepConfig = stopDeepConfigFlag;

window.of = of;

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
