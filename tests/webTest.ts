import { Bears } from './test-classes/basicClasses';
import { Inject, Injectable, of, registerDepsConfig } from '../src';
import { ClassesConfig } from './test-classes/classesConfig';
import { Grassland } from './test-classes/extendsClasses';

registerDepsConfig(ClassesConfig);

export function test(): void {}

test();
