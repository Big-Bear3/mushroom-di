/* eslint-disable @typescript-eslint/no-unused-vars */

import { Squirrel, BlackSquirrel } from './test-classes/cachedClasses';
import { by, DependencyConfig, of, registerDepsConfig } from '../src';
import { ClassesConfig } from './test-classes/classesConfig';
import { DependencyConfigEntity } from '../src/dependency-config/dependencyConfigEntity';

registerDepsConfig(ClassesConfig);

let squirrelCreateTimes = 0;
let blackSquirrelCreateTimes = 0;

export class CachedClassesConfig {
    @DependencyConfig(Squirrel)
    static configSquirrel(configEntity: DependencyConfigEntity<typeof Squirrel>): void {
        configEntity.afterInstanceCreate = () => {
            squirrelCreateTimes++;
        };
    }

    @DependencyConfig(BlackSquirrel)
    static configBlackSquirrel(configEntity: DependencyConfigEntity<typeof BlackSquirrel>): void {
        configEntity.afterInstanceCreate = () => {
            blackSquirrelCreateTimes++;
        };
    }
}

export function testCache(): void {
    squirrelCreateTimes = 0;

    const squirrel1 = of(Squirrel);
    const squirrel2 = of(Squirrel);

    if (squirrel1 !== squirrel2) {
        console.error(1);
    }

    setTimeout(() => {
        of(Squirrel);
        console.log(squirrelCreateTimes + '------');
    }, 2000);
    setTimeout(() => {
        of(Squirrel);
        console.log(squirrelCreateTimes + '------');
    }, 4000);
    setTimeout(() => {
        of(Squirrel);
        console.log(squirrelCreateTimes + '------');
    }, 6000);
    setTimeout(() => {
        of(Squirrel);
        console.log(squirrelCreateTimes + '------');
    }, 8000);

    // setTimeout(() => {
    //     console.log(squirrel1);
    // }, 9999);

    const following = { a: [] };
    for (let i = 0; i < 100000; i++) {
        following.a.push(Math.random() + '');
    }

    blackSquirrelCreateTimes = 0;

    const blackSquirrel = by(BlackSquirrel, following);

    setTimeout(() => {
        by(BlackSquirrel, {});
        console.log(blackSquirrelCreateTimes + '======');
    }, 2000);
    setTimeout(() => {
        by(BlackSquirrel, {});
        console.log(blackSquirrelCreateTimes + '======');
    }, 4000);
    setTimeout(() => {
        by(BlackSquirrel, {});
        console.log(blackSquirrelCreateTimes + '======');
    }, 6000);
    setTimeout(() => {
        by(BlackSquirrel, {});
        console.log(blackSquirrelCreateTimes + '======');
    }, 8000);

    // setTimeout(() => {
    //     console.log(following);
    // }, 9999);
}

testCache();
