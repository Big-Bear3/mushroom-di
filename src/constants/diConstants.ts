import { InjectableOptions } from '../types/diTypes';

export const defaultInjectableOptions: InjectableOptions = {
    type: 'multiple'
};

export const messageNewLineSign = '\n    ';

export const AUTO = Symbol('DI-AUTO');

export const STOP_DEEP_CONFIG = Symbol('DI-STOP-DEEP-CONFIG');
