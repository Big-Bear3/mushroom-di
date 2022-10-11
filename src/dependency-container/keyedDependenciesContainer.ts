import type { NormalClass, KeyedDependencyKey, WeakKeyedDependencyKey } from '../types/diTypes';

import { Message } from 'src/utils/message';

/** 用于管理所有带有键的依赖 */
export class KeyedDependenciesContainer {
    private static instance: KeyedDependenciesContainer;

    private keyedDependenciesMap = new Map<NormalClass, Map<KeyedDependencyKey, any>>();
    private weakKeyedDependenciesMap = new Map<NormalClass, WeakMap<WeakKeyedDependencyKey, any>>();

    addDependency<T>(nc: NormalClass<T>, instance: T, key: KeyedDependencyKey, isWeak?: boolean): void {
        // if (!instance) Message.throwError('29005', `向Mushroom容器中添加的对象不能为空！${messageNewLineSign}class: ${nc.name}`);

        if (isWeak) {
            if (typeof key !== 'object')
                Message.throwError('19001', '将非object类型用作了weakKeyedDependenciesMap对象中WeakMap的键！');

            this.keyedDependenciesMap.get(nc)?.delete(key);

            let instanceWeakMap = this.weakKeyedDependenciesMap.get(nc);
            if (!instanceWeakMap) {
                instanceWeakMap = new WeakMap();
                this.weakKeyedDependenciesMap.set(nc, instanceWeakMap);
            }

            instanceWeakMap.set(<WeakKeyedDependencyKey>key, instance);
        } else {
            if (typeof key === 'object') this.weakKeyedDependenciesMap.get(nc)?.delete(key);

            let instanceMap = this.keyedDependenciesMap.get(nc);
            if (!instanceMap) {
                instanceMap = new Map();
                this.keyedDependenciesMap.set(nc, instanceMap);
            }

            instanceMap.set(key, instance);
        }
    }

    getDependency<T>(nc: NormalClass<T>, key?: KeyedDependencyKey): T {
        let instance = this.keyedDependenciesMap.get(nc)?.get(key);
        if (instance) return instance;

        if (typeof key === 'object') {
            instance = this.weakKeyedDependenciesMap.get(nc)?.get(key);
            if (instance) return instance;
        }
        return undefined;
    }

    removeDependency<T>(nc: NormalClass<T>, key?: KeyedDependencyKey): boolean {
        let isReallyDelete = this.keyedDependenciesMap.get(nc)?.delete(key);
        if (isReallyDelete) return true;

        if (!isReallyDelete && typeof key === 'object') {
            isReallyDelete = this.weakKeyedDependenciesMap.get(nc)?.delete(key);
            if (isReallyDelete) return true;
        }
        return false;
    }

    static getInstance(): KeyedDependenciesContainer {
        if (!KeyedDependenciesContainer.instance) {
            KeyedDependenciesContainer.instance = new KeyedDependenciesContainer();
        }
        return KeyedDependenciesContainer.instance;
    }
}
