// /* eslint-disable @typescript-eslint/no-unused-vars */

// import type { Class, NormalClass } from './../src/types/diTypes';

// import { Animal } from './test-classes/extendsClasses';
// import { Honey, Bear, Zoo, BrownBear } from './test-classes/basicClasses';
// import { of, by, DependencyConfig } from '../src';
// import { DependencyConfigEntity } from '../src/dependency-config/dependencyConfigEntity';

// const bear = of(Bear); // Bear
// const instances = of(Bear, Honey, Animal); // [Bear, Honey, Animal]

// const zoo1 = by(Zoo); //// Expected at least 2 arguments, but got 1.
// const zoo2 = by(Zoo, null, null); // by<typeof Zoo>(c: typeof Zoo, brownBear: BrownBear, brownBears: BrownBears): Zoo
// const zoo3 = by(Zoo, null, null, null); // by<typeof Zoo, [any, any, any]>(c: typeof Zoo, args_0: any, args_1: any, args_2: any): Zoo

// type BearClass = Class<Bear>; // abstract new (...args: any[]) => Bear
// type BearNormalClass = NormalClass<Bear>; // new (...args: any[]) => Bear

// export class ClassConfig {
//     @DependencyConfig(Zoo)
//     static configZoo1(configEntity: DependencyConfigEntity<typeof Zoo>): Zoo | void {
//         const args = configEntity.args; // [brownBear: BrownBear, brownBears: BrownBears]
//         configEntity.args = []; //// Type '[]' is not assignable to type '[brownBear: BrownBear, brownBears: BrownBears]'
//     }

//     @DependencyConfig(Zoo)
//     static configZoo2(configEntity: DependencyConfigEntity<typeof Zoo, typeof BrownBear>): Zoo | void {
//         const args = configEntity.args; // [age: number]
//         configEntity.args = [null, null]; //// Type '[null, null]' is not assignable to type '[age: number]'
//     }

//     @DependencyConfig(Zoo)
//     static configZoo3(configEntity: DependencyConfigEntity<typeof Zoo, [string, string]>): Zoo | void {
//         const args = configEntity.args; // [string, string]
//         configEntity.args = []; //// Type '[]' is not assignable to type '[string, string]'
//     }

//     @DependencyConfig(Zoo)
//     static configZoo4(configEntity: DependencyConfigEntity<typeof Zoo | typeof BrownBear>): Zoo | void {
//         const usingClass = configEntity.usingClass; // Class<Zoo | BrownBear>
//         const afterInstanceCreate = configEntity.afterInstanceCreate; // (instance: Zoo | BrownBear) => void
//         const afterInstanceFetch = configEntity.afterInstanceFetch; // (instance: Zoo | BrownBear, isNew: boolean) => void
//     }
// }
