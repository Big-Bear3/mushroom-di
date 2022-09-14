export interface IInjector {
    inject<T>(c: NormalClass<T>, ...args: any[]): T;
}
