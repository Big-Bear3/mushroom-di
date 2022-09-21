import { Class, GenericType } from '../types/diTypes';

export class DependencyConfigEntity<T extends Class = any, A extends Class | any[] = never> {
    usingClass: Class<GenericType<T>>;

    args: ConstructorParameters<T> | (A extends Class ? ConstructorParameters<A> : A);

    constructor(
        usingClass: Class<GenericType<T>>,
        args?: ConstructorParameters<T> | (A extends Class ? ConstructorParameters<A> : A)
    ) {
        this.usingClass = usingClass;
        this.args = (args || []) as ConstructorParameters<T> | (A extends Class ? ConstructorParameters<A> : A);
    }
}
