import { CircularClassA, CircularClassB, CircularClassC, CircularClassE } from './test-classes/circularClasses';
import { Animal, BrownBear, Zoo } from './test-classes/basicClasses';
import { BrownMonkey, Monkey, YellowMonkey } from './test-classes/configedClasses';
import { registerDepsConfig } from '../src';
import { ClassesConfig, useMonkey } from './test-classes/classesConfig';

registerDepsConfig(ClassesConfig);

export function test(): void {}

test();
