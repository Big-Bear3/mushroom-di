import type { DependencyKey, NormalClass, DependencyWeakKey } from './types/diTypes';

import { Message } from './utils/message';
import { Injectable } from './decorators/injectable';
import { SingletonDependenciesContainer } from './dependency-container/singletonDependenciesContainer';
import { KeyedDependenciesContainer } from './dependency-container/keyedDependenciesContainer';
import { CachedDependenciesContainer } from './dependency-container/cachedDependenciesContainer';
import { messageNewLineSign } from './constants/diConstants';
import { ModularKeysTupleToObjects, ModularKeysObject, ModularValues } from './types/valueDepTypes';
import { ValueDependenciesManager } from './dependency/valueDependenciesManager';
import { InjectVal as InjectValDecorator } from './decorators/injectVal';

@Injectable({ type: 'singleton' })
export class MushroomService {
    #keyedDependenciesContainer = KeyedDependenciesContainer.getInstance();

    #singletonDependenciesContainer = SingletonDependenciesContainer.getInstance();

    constructor() {
        if (this.#singletonDependenciesContainer.getDependency(<NormalClass<MushroomService>>MushroomService))
            Message.throwError('29003', '请通过依赖查找或依赖注入的方式获取MushroomService实例！');
    }

    addDependencyWithKey<T>(nc: NormalClass<T>, instance: T, key: DependencyKey): void {
        if (!instance) Message.throwError('29005', `向Mushroom容器中添加的对象不能为空！${messageNewLineSign}class: ${nc.name}`);
        this.#keyedDependenciesContainer.addDependency(nc, instance, key);
    }

    addDependencyWithWeakKey<T>(nc: NormalClass<T>, instance: T, key: DependencyWeakKey): void {
        if (!instance) Message.throwError('29006', `向Mushroom容器中添加的对象不能为空！${messageNewLineSign}class: ${nc.name}`);
        this.#keyedDependenciesContainer.addDependency(nc, instance, key, true);
    }

    getDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): T {
        return this.#keyedDependenciesContainer.getDependency(nc, key);
    }

    containsDependencyWithKey<T>(nc: NormalClass<T>, key: DependencyKey): boolean {
        return this.#keyedDependenciesContainer.containsDependency(nc, key);
    }

    removeDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): boolean {
        return this.#keyedDependenciesContainer.removeDependency(nc, key);
    }

    destroyCachedInstance(nc: NormalClass): boolean {
        return CachedDependenciesContainer.getInstance().removeDependency(nc);
    }

    destroySingletonInstance(nc: NormalClass): boolean {
        if (nc === MushroomService) Message.throwError('29004', '禁止销毁MushroomService实例！');

        return this.#singletonDependenciesContainer.removeDependency(nc);
    }

    buildValueDepsManager<T extends ModularValues>(values?: T) {
        const valueDependenciesManager = ValueDependenciesManager.getInstance();
        if (valueDependenciesManager.alreadyBuilt) Message.throwError('29009', '不能重复构建值依赖管理器！');

        valueDependenciesManager.setValues(values);

        function patchVal<U extends ModularKeysObject<T>, K extends keyof U>(key: K, value: U[K]): void;
        function patchVal<U extends ModularKeysObject<T>, K extends keyof U>(keyValuePairs: {
            [P in K]: U[P];
        }): void;
        function patchVal(keyOrKeyValuePairs: string | Record<string, unknown>, value?: unknown): void {
            if (typeof keyOrKeyValuePairs === 'string') {
                valueDependenciesManager.patchValue(keyOrKeyValuePairs, value);
            } else {
                for (const keyItem of Object.keys(keyOrKeyValuePairs)) {
                    valueDependenciesManager.patchValue(keyItem, keyOrKeyValuePairs[keyItem]);
                }
            }
        }

        function takeVal<U extends ModularKeysObject<T>, K extends keyof U>(key: K): U[K];
        function takeVal<U extends ModularKeysObject<T>, K extends [keyof U, ...(keyof U)[]]>(
            ...key: K
        ): ModularKeysTupleToObjects<U, K>;
        function takeVal(...keyOrKeys: string[]): unknown {
            if (keyOrKeys.length === 1) return valueDependenciesManager.takeValue(keyOrKeys[0]);

            const targetValues = [];
            for (const key of keyOrKeys) {
                targetValues.push(valueDependenciesManager.takeValue(key));
            }
            return targetValues;
        }

        const InjectVal: <U extends ModularKeysObject<T>, K extends keyof U>(key: K, defaultValues?: U[K]) => PropertyDecorator =
            <any>InjectValDecorator;

        return { patchVal, takeVal, InjectVal };
    }
}
