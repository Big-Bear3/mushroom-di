import { Injectable, of } from '../../src';

let circularSwitch1 = true;

export function toggleCircularSwitch1(state: boolean) {
    circularSwitch1 = state;
}

@Injectable({ type: 'multiple' })
export class CircularClassA {
    constructor() {
        of(CircularClassB);
        of(CircularClassC);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassB {
    constructor() {
        of(CircularClassD);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassC {
    constructor() {
        of(CircularClassE);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassD {
    constructor(public c: CircularClassC) {
        of(CircularClassE);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassE {
    constructor() {
        if (!circularSwitch1) return;
        of(CircularClassA);
    }
}
