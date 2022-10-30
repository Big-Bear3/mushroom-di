import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { by, DependencyConfig, Inject, Injectable } from '../../src';

export const numberPropName = 123;
export const symbolPropName = Symbol('symbolPropName');

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

    @Inject()
    [numberPropName]: Honey;

    @Inject()
    [symbolPropName]: Honey;

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

@Injectable()
export class Snake {
    name = 'Snake';

    @Inject()
    static num1: number;

    @Inject({ lazy: true })
    static num2: number;

    @Inject()
    num3: number;

    @Inject({ lazy: true })
    num4: number;

    @Inject(null)
    num5: number;

    @Inject(null, { lazy: true })
    num6: number;

    @Inject()
    static animal1: Animal;

    @Inject(Animal)
    static animal2: Animal;

    @Inject()
    animal3: Animal;

    @Inject(Animal)
    animal4: Animal;

    constructor(public num7: number, public animal5: Animal) {}
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

@Injectable()
export class InvalidConfigZoo1 {
    @DependencyConfig(InvalidConfigZoo1)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo1>): void {
        configEntity.usingClass = null;
    }
}

@Injectable()
export class InvalidConfigZoo2 {
    @DependencyConfig(InvalidConfigZoo2)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo2>): void {
        configEntity.usingClass = {} as any;
    }
}

@Injectable()
export class InvalidConfigZoo3 {
    @DependencyConfig(InvalidConfigZoo3)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo3>): void {
        configEntity.args = undefined;
    }
}

@Injectable()
export class InvalidConfigZoo4 {
    @DependencyConfig(InvalidConfigZoo4)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo4>): void {
        configEntity.args = 123 as any;
    }
}

@Injectable()
export class InvalidConfigZoo5 {
    @DependencyConfig(InvalidConfigZoo5)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo5>): void {
        configEntity.afterInstanceCreate = 123 as any;
    }
}

@Injectable()
export class InvalidConfigZoo6 {
    @DependencyConfig(InvalidConfigZoo6)
    static configMonkey(configEntity: DependencyConfigEntity<typeof InvalidConfigZoo6>): void {
        configEntity.afterInstanceFetch = 123 as any;
    }
}

@Injectable({ setTo: 'inextensible' })
export class Fox {
    food = 'fish';
}

@Injectable({ setTo: 'sealed' })
export class Penguin {
    food = 'fish';
}

@Injectable({ type: 'singleton', setTo: 'frozen' })
export class PolarBear {
    food = 'fish';

    @Inject({ lazy: true })
    static friend1: BrownBear;

    @Inject({ lazy: true })
    friend2: BrownBear;
}
