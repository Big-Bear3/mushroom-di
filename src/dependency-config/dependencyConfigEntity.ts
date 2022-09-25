import type { Class, GenericType } from '../types/diTypes';

type ArgsType<T extends Class, A extends Class | any[]> = A extends never
    ? ConstructorParameters<T>
    : A extends Class
    ? ConstructorParameters<A>
    : A;

export class DependencyConfigEntity<T extends Class = any, A extends Class | any[] = never> {
    usingClass: Class<GenericType<T>>;

    args: ArgsType<T, A>;

    constructor(usingClass: Class<GenericType<T>>, args?: ArgsType<T, A>) {
        this.usingClass = usingClass;
        this.args = (args || []) as ArgsType<T, A>;
    }
}
