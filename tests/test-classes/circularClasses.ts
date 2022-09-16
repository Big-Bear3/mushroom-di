import { Injectable } from '../../src';

@Injectable({ type: 'multiple' })
export class CircularClassA {
    constructor() {
        const b = of(CircularClassB);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassB {
    constructor() {
        const c = of(CircularClassC);
    }
}

@Injectable({ type: 'multiple' })
export class CircularClassC {
    constructor() {
        const a = of(CircularClassA);
    }
}
