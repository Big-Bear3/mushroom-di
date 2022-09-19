import { Injectable } from '../../src';

export class Animal {}

@Injectable({ type: 'multiple' })
export class Bear extends Animal {}

@Injectable({ type: 'singleton' })
export class BrownBear extends Bear {
    age: number;

    constructor(age: number) {
        super();
        this.age = age;
    }
}

@Injectable({ type: 'multiple' })
export class Animals {
    name = 'Animals';
}

@Injectable({ type: 'multiple' })
export class Bears extends Animals {}

@Injectable({ type: 'multiple' })
export class BrownBears extends Bears {
    age: number;

    constructor(age: number) {
        super();
        this.age = age;
    }
}

@Injectable({ type: 'singleton' })
export class Zoo {
    brownBear: BrownBear;
    brownBears: BrownBears;
    brownBearBy: BrownBear;
    brownBearsBy: BrownBears;

    constructor(brownBear: BrownBear, brownBears: BrownBears) {
        this.brownBear = brownBear;
        this.brownBears = brownBears;
        this.brownBearBy = by(BrownBear, 5);
        this.brownBearsBy = by(BrownBears, 12);
    }
}
