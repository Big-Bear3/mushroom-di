import { InjectorType } from '../types/diTypes';
import { Message } from '../utils/message';
import { IInjector } from './injectorInterface';
import { MultipleInjector } from './multipleInjector';
import { SingletonInjector } from './singletonInjector';

export class InjectorFactory {
    static getInjector(injectorType: InjectorType): IInjector {
        let targetInjector: IInjector;
        switch (injectorType) {
            case 'multiple':
                targetInjector = MultipleInjector.getInstance();
                break;
            case 'singleton':
                targetInjector = SingletonInjector.getInstance();
                break;
            default:
                Message.throwError('29003', `未知的注入类型 "${injectorType}"！`);
        }
        return targetInjector;
    }
}
