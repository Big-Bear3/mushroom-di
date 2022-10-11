import type { DependencyKey, NormalClass, DependencyWeakKey } from './types/diTypes';

import { Message } from './utils/message';
import { Injectable } from './decorators/injectable';
import { SingletonDependenciesContainer } from './dependency-container/singletonDependenciesContainer';
import { KeyedDependenciesContainer } from './dependency-container/keyedDependenciesContainer';
import { CachedDependenciesContainer } from './dependency-container/cachedDependenciesContainer';

@Injectable({ type: 'singleton' })
export class MushroomService {
    #keyedDependenciesContainer = KeyedDependenciesContainer.getInstance();

    #cachedDependenciesContainer = CachedDependenciesContainer.getInstance();

    #singletonDependenciesContainer = SingletonDependenciesContainer.getInstance();

    constructor() {
        if (this.#singletonDependenciesContainer.getDependency(<NormalClass<MushroomService>>MushroomService))
            Message.throwError('29003', '请通过依赖查找或依赖注入的方式获取MushroomService实例！');
    }

    addDependencyWithKey<T>(nc: NormalClass<T>, instance: T, key: DependencyKey): void {
        this.#keyedDependenciesContainer.addDependency(nc, instance, key);
    }

    addDependencyWithWeakKey<T>(nc: NormalClass<T>, instance: T, key: DependencyWeakKey): void {
        this.#keyedDependenciesContainer.addDependency(nc, instance, key, true);
    }

    getDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): T {
        return this.#keyedDependenciesContainer.getDependency(nc, key);
    }

    removeDependencyByKey<T>(nc: NormalClass<T>, key: DependencyKey): boolean {
        return this.#keyedDependenciesContainer.removeDependency(nc, key);
    }

    destroyCachedInstance(nc: NormalClass, key: DependencyWeakKey): boolean {
        return this.#cachedDependenciesContainer.removeDependency(nc, key);
    }

    destroySingletonInstance(nc: NormalClass): boolean {
        if (nc === MushroomService) Message.throwError('29004', '禁止销毁MushroomService实例！');

        return this.#singletonDependenciesContainer.removeDependency(nc);
    }
}
