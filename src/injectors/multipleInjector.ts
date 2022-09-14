import { IInjector } from './injectorInterface';

export class MultipleInjector implements IInjector {
    private static instance: MultipleInjector;

    private constructor() {}

    inject<T>(c: NormalClass<T>, ...args: any[]): T {
        const TargetClass = c;
        let instance: T;
        if (args.length > 0) {
            instance = new TargetClass(...args);
        } else {
            instance = new TargetClass();
        }
        return instance;
    }

    static getInstance(): MultipleInjector {
        if (!MultipleInjector.instance) {
            MultipleInjector.instance = new MultipleInjector();
        }
        return MultipleInjector.instance;
    }
}
