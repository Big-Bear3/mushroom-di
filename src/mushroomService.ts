import type { NormalClass } from './types/diTypes';

import { Message } from './utils/message';
import { Injectable } from './decorators/injectable';
import { SingletonDependenciesManager } from './dependency-manager/singletonDependenciesManager';

@Injectable({ type: 'singleton' })
export class MushroomService {
    #singletonDependenciesManager = SingletonDependenciesManager.getInstance();

    constructor() {
        if (this.#singletonDependenciesManager.getDependency(<NormalClass<MushroomService>>MushroomService))
            Message.throwError('29003', '请通过依赖查找或依赖注入的方式获取MushroomService实例！');
    }

    destroySingletonInstance(nc: NormalClass): void {
        if (nc === MushroomService) Message.throwError('29004', '禁止销毁MushroomService实例！');

        this.#singletonDependenciesManager.removeDependency(nc);
    }
}
