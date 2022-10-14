import './webCachedTest';

import { registerDepsConfig } from '../src';
import { ClassesConfig } from './test-classes/classesConfig';

registerDepsConfig(ClassesConfig);

export function test(): void {}

test();
