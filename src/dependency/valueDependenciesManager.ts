import type { ObjectType } from '../types/diTypes';
import type { ModularValues } from '../types/valueDepTypes';

import { Message } from '../utils/message';
import { MODULE } from '../constants/diConstants';

/** 用于管理所有值依赖 */
export class ValueDependenciesManager {
    private static _instance: ValueDependenciesManager;

    /** 模块化的所有值 */
    private modularValues: ModularValues;

    /** 值依赖管理器是否已经构建 */
    private _alreadyBuilt: boolean;

    get alreadyBuilt(): boolean {
        return this._alreadyBuilt;
    }

    /** 设置所有值 */
    setValues(values: ModularValues | ObjectType) {
        this._alreadyBuilt = true;

        if (values === null || values === undefined) return;

        if (typeof values !== 'object') Message.throwError('29010', '构建值依赖管理器的初始值必须是object类型！');

        this.modularValues = <ModularValues>values;
    }

    /** 根据key去更新值 */
    patchValue(key: string, value: unknown): void {
        /* istanbul ignore next */
        if (typeof key !== 'string') Message.throwError('29011', 'key必须是string类型！');

        if (!this.modularValues) this.modularValues = {} as ModularValues;

        const keySeries = key.split('.');

        let lastObj: Partial<ModularValues> = this.modularValues;
        for (let i = 0; i < keySeries.length - 1; i++) {
            let modularObj = lastObj[MODULE];
            if (!modularObj) {
                modularObj = {};
                lastObj[MODULE] = modularObj;
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
            lastObj = lastObj?.[MODULE]?.[keySeries[i]];
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
