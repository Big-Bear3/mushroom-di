import { by, Inject, Injectable } from '../../src';

@Injectable({ type: 'multiple' })
export class Honey {
    honeyType = 'Jujube honey';
}

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
export class Bears extends Animals {
    @Inject()
    honey: Honey;

    @Inject()
    honey2: Honey;

    @Inject({ lazy: true })
    honeyLazy: Honey;

    @Inject({ lazy: true })
    honeyLazy2: Honey;
}

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

@Injectable()
export class ErrorZoo {
    constructor(private brownBear: BrownBear, private brownBears: BrownBears) {
        throw new Error();
    }
}
