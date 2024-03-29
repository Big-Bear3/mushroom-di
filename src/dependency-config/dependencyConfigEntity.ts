import type { Class, GenericType } from '../types/diTypes';

type ArgsType<T extends Class, A extends Class | unknown[]> = A extends undefined
    ? ConstructorParameters<T>
    : A extends Class
      ? ConstructorParameters<A>
      : A;

/** 该类用于存放配置的依赖所使用的类和构造方法参数 */
export class DependencyConfigEntity<T extends Class = Class, A extends Class | unknown[] = undefined> {
    usingClass: Class<GenericType<T>>;

    args: ArgsType<T, A>;

    afterInstanceCreate: (instance: InstanceType<T>) => void;

    afterInstanceFetch: (instance: InstanceType<T>, isNew: boolean) => void;

    constructor(usingClass: Class<GenericType<T>>, args?: ArgsType<T, A>) {
        this.usingClass = usingClass;
        this.args = args;
        this.afterInstanceCreate = undefined;
        this.afterInstanceFetch = undefined;
    }
}
