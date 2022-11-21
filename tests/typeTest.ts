// /* eslint-disable @typescript-eslint/no-unused-vars */

// import type { Class, NormalClass } from './../src/types/diTypes';

// import { Animal } from './test-classes/extendsClasses';
// import { Honey, Bear, Zoo, BrownBear } from './test-classes/basicClasses';
// import { of, by, DependencyConfig, Injectable, MushroomService } from '../src';
// import { DependencyConfigEntity } from '../src/dependency-config/dependencyConfigEntity';
// import { modularValues } from './valueTest.spec';

// const bear1 = of(Bear); // Bear
// const bear2 = of<Bear>(Bear); // Bear
// const bear3 = of<typeof Bear>(Bear); // Bear
// const instances1 = of(Bear, Honey, Animal); // [Bear, Honey, Animal]
// const instances2 = of<[Bear, Honey, Animal]>(Bear, Honey, Animal); // [Bear, Honey, Animal]
// const instances3 = of<[typeof Bear, typeof Honey, typeof Animal]>(Bear, Honey, Animal); // [Bear, Honey, Animal]

// const zoo1 = by(Zoo); //// Expected at least 2 arguments, but got 1.
// const zoo2 = by<Zoo>(Zoo); //// Type 'Zoo' does not satisfy the constraint 'Class<any>'.
// const zoo4 = by(Zoo, null, null); // by<typeof Zoo>(c: typeof Zoo, brownBear: BrownBear, brownBears: BrownBears): Zoo
// const zoo3 = by<typeof Zoo>(Zoo, null, null); // by<typeof Zoo>(c: typeof Zoo, brownBear: BrownBear, brownBears: BrownBears): Zoo
// const zoo5 = by<Zoo, [string, string]>(Zoo, null, null); // by<Zoo, [string, string]>(c: Class<Zoo>, args_0: string, args_1: string): Zoo
// const zoo6 = by<typeof Zoo, [string, string]>(Zoo, null, null); // by<typeof Zoo, [string, string]>(c: typeof Zoo, args_0: string, args_1: string): Zoo
// const zoo7 = by(Zoo, null, null, null); // by<typeof Zoo, [any, any, any]>(c: typeof Zoo, args_0: any, args_1: any, args_2: any): Zoo

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

// @Injectable<CachedClass1>({
//     type: 'cached',
//     //// Type 'number' is not assignable to type 'ObjectType'.
//     follow: function () {
//         this.type; //// Property 'type' does not exist on type 'CachedClass'
//         this.following; // CachedClass1.following: unknown
//         return 123;
//     }
// })
// export class CachedClass1 {
//     constructor(public following: unknown) {}
// }

// @Injectable<CachedClass2>({
//     type: 'cached',
//     follow: (cachedClass2) => ({}) // cachedClass2: CachedClass2
// })
// export class CachedClass2 {}

// @Injectable<CachedClass3>({
//     type: 'cached' // type: "cached"
// })
// export class CachedClass3 {}

// @Injectable<CachedClass4>({
//     type: 'singleton',
//     follow: () => {} //// Argument of type '{ type: "singleton"; follow: () => void; }' is not assignable to parameter of type 'InjectableOptions<CachedClass4>'
// })
// export class CachedClass4 {}

// const { patchVal, takeVal, InjectVal } = of(MushroomService).buildValueDepsManager(modularValues);

// patchVal('app.theme.mode', 'dark'); // no error
// patchVal('app.theme.mode', 'custom'); //// Argument of type '"custom"' is not assignable to parameter of type '"dark" | "light"'.
// patchVal('app.theme.error', 'custom'); //// Argument of type '"app.theme.error"' is not assignable to parameter of type...

// patchVal({ 'user.userId': '123' }); //// Type 'string' is not assignable to type 'number'.
// patchVal({ 'user.userIds': 1 }); //// Argument of type '{ 'user.userIds': number; }' is not assignable to parameter of type

// const value1 = takeVal('app.isLoading'); // const value1: boolean
// const value2 = takeVal('app.theme.mode'); // const value2: "light" | "dark"

// const values = takeVal('app.isLoading', 'app.theme.mode'); // [boolean, "light" | "dark"]

// export class ValuesClass1 {
//     @InjectVal('app.theme.mode') // no error
//     @InjectVal('user') //// Argument of type '"user"' is not assignable to parameter of type...
//     @InjectVal('user.role.roles', '1') //// Argument of type 'string' is not assignable to parameter of type 'string[]'
//     value: unknown;
// }
