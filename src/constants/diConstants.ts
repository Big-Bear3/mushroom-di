import type { InjectableOptions } from '../types/diTypes';
import type { InjectOptions } from './../types/diTypes';

export const defaultInjectableOptions: InjectableOptions = {
    type: 'multiple'
};

export const defaultInjectOptions: InjectOptions = {
    lazy: false
};

export const messageNewLineSign = '\n    ';

export const AUTO = Symbol('DI-AUTO');

export const STOP_DEEP_CONFIG = Symbol('DI-STOP-DEEP-CONFIG');
