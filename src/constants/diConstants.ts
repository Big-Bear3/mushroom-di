import { InjectableOptions } from '../types/diTypes';

export const defaultInjectableOptions: InjectableOptions = {
    type: 'multiple'
};

export const diAuto = Symbol('DI-AUTO');

export const stopDeepConfig = Symbol('DI-STOP-DEEP-CONFIG');
