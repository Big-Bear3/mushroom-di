import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { DependencyConfig, Inject, Injectable } from '../../src';

export interface IRacoon {
    name: string;
}
@Injectable()
export class Racoon implements IRacoon {
    constructor(public name: string) {}
}

@Injectable()
export class Island {
    @Inject(Symbol.for('racoon'))
    racoon: IRacoon;

    @Inject(Symbol.for('racoon'), { lazy: true })
    lazyRacoon: IRacoon;

    @DependencyConfig(Symbol.for('staticRacoon'))
    static configRacoon(configEntity: DependencyConfigEntity<typeof Racoon>): void {
        configEntity.usingClass = Racoon;
        configEntity.args = ['racoon!'];
    }

    @Inject(Symbol.for('staticRacoon'))
    static staticRacoon: IRacoon;
}

@Injectable()
export class SmallIsland extends Island {
    @Inject(Symbol.for('racoon'))
    smallRacoon: IRacoon;

    @Inject(Symbol.for('racoon'), { lazy: true })
    lazySmallRacoon: IRacoon;

    @Inject(Symbol.for('racoon'), { lazy: true })
    static staticLazySmallRacoon: IRacoon;
}

@Injectable()
export class RedRacoon implements IRacoon {
    static food: string;

    constructor(public name: string) {}
}

@Injectable()
export class BrownRacoon implements IRacoon {
    static food: string;

    constructor(public name: string) {}

    @DependencyConfig(BrownRacoon)
    static configBrownRacoon(configEntity: DependencyConfigEntity<typeof BrownRacoon>): void {
        configEntity.usingClass = BrownRacoon;
        configEntity.args = ['racoon!'];

        configEntity.afterInstanceFetch = () => {
            BrownRacoon.food = 'corn';
        };
    }
}
