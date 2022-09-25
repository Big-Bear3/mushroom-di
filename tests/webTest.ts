import { Bears } from './test-classes/basicClasses';
import { Inject, Injectable, of, registerDepsConfig } from '../src';
import { ClassesConfig } from './test-classes/classesConfig';

registerDepsConfig(ClassesConfig);

@Injectable({ type: 'multiple' })
export class Honey {
    honeyType = 'Jujube honey';
}

@Injectable({ type: 'multiple' })
export class Bee {
    @Inject()
    honey: Honey;

    @Inject({ lazy: true })
    static honeyStatic: Honey;
}

export function test(): void {
    const a1 = of(Bears);
    // const a2 = of(Bee);
    const b1 = a1.honey;
    // const b2 = a2.honey;

    // const j = b1 === b2;
    debugger;
}

test();
