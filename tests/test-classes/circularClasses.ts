import { Injectable } from '../../src';

let circularSwitch1 = true;

export function toggleCircularSwitch1(state: boolean) {
    circularSwitch1 = state;
}

@Injectable({ type: 'multiple' })
export class CircularClassA {
    constructor() {
        const b = of(CircularClassB);
        const c = of(CircularClassC);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassB {
    constructor() {
        const d = of(CircularClassD);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassC {
    constructor() {
        const e = of(CircularClassE);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassD {
    constructor(public c: CircularClassC) {
        const e = of(CircularClassE);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassE {
    constructor() {
        if (!circularSwitch1) return;
        const a = of(CircularClassA);
    }
}
