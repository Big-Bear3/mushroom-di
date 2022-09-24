import { Bears, Zoo, BrownBears } from './test-classes/basicclasses';
import { Inject, Injectable, of, registerDepsConfig } from '../src';
import { ClassesConfig } from './test-classes/classesConfig';

registerDepsConfig(ClassesConfig);

export function test(): void {
    const a1 = of(BrownBears);
    debugger;
}

test();
