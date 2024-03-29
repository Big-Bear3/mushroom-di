import type { ObjectType } from '../types/diTypes';
import type { ModularValues } from '../types/valueDepTypes';

import { Message } from '../utils/message';
import { DiConstants } from '../constants/diConstants';

/** 该类用于管理所有值依赖 */
export class ValueDependenciesManager {
    private static _instance: ValueDependenciesManager;

    /** 模块化的所有的值 */
    private modularValues: ModularValues;

    /** 值依赖管理器是否已经构建 */
    private _alreadyBuilt: boolean;

    get alreadyBuilt(): boolean {
        return this._alreadyBuilt;
    }

    /** 设置所有的值 */
    setValues(values: ModularValues | ObjectType) {
        this._alreadyBuilt = true;

        if (values === null || values === undefined) return;

        if (typeof values !== 'object') Message.throwError('29010', '构建值依赖管理器的初始值必须是object类型！');

        this.modularValues = <ModularValues>values;
    }

    /** 根据key去更新值 */
    patchValue(key: string, value: unknown): void {
        /* c8 ignore next */ // 从外部调用不会产生此异常
        if (typeof key !== 'string') Message.throwError('19001', 'key必须是string类型！');

        if (!this.modularValues) this.modularValues = {} as ModularValues;

        const keySeries = key.split('.');

        let lastObj: Partial<ModularValues> = this.modularValues;
        for (let i = 0; i < keySeries.length - 1; i++) {
            let modularObj = lastObj[DiConstants.MODULE];
            if (!modularObj) {
                modularObj = {};
                lastObj[DiConstants.MODULE] = modularObj;
            }
            let currentObj = modularObj[keySeries[i]];
            if (!currentObj) {
                currentObj = {};
                modularObj[keySeries[i]] = currentObj;
            }
            lastObj = currentObj;
        }

        lastObj[keySeries[keySeries.length - 1]] = value;
    }

    /** 根据key去取值 */
    takeValue(key: string): unknown {
        if (typeof key !== 'string') Message.throwError('29012', 'key必须是string类型！');
        if (!this.modularValues) return undefined;

        const keySeries = key.split('.');

        let lastObj: Partial<ModularValues> = this.modularValues;
        for (let i = 0; i < keySeries.length - 1; i++) {
            lastObj = lastObj?.[DiConstants.MODULE]?.[keySeries[i]];
            if (!lastObj) return undefined;
        }
        return lastObj[keySeries[keySeries.length - 1]];
    }

    static get instance(): ValueDependenciesManager {
        if (!ValueDependenciesManager._instance) {
            ValueDependenciesManager._instance = new ValueDependenciesManager();
        }
        return ValueDependenciesManager._instance;
    }
}
