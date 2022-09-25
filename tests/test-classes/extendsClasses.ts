import { Inject } from '../../src/decorators/inject';
import { Injectable } from '../../src';

@Injectable()
export class Grass {}

@Injectable()
export class Meat {}

@Injectable()
export class RabitMeat extends Meat {
    @Inject()
    food: Grass;
}

@Injectable({ type: 'singleton' })
export class DeerMeat extends Meat {
    @Inject()
    food: Grass;
}

@Injectable()
export class Earth {}

@Injectable()
export class Mars {
    static initedFlag = false;

    constructor() {
        Mars.initedFlag = true;
    }
}

@Injectable()
export class SolarSystem {
    @Inject({ lazy: true })
    static planet: Mars;
}

@Injectable()
export class Animal {
    code = '@Animal@';

    @Inject()
    static planet1: Earth;

    @Inject({ lazy: true })
    static planet2: Mars;
}

@Injectable()
export class Lion extends Animal {
    @Inject()
    foodType: Meat;
}

@Injectable()
export class MaleLion extends Lion {
    @Inject()
    food: DeerMeat;
}

@Injectable()
export class FemaleLion extends Lion {
    @Inject({ lazy: true })
    food: RabitMeat;

    static initedFlag = false;

    constructor() {
        super();
        FemaleLion.initedFlag = true;
    }
}

@Injectable()
export class Grassland {
    @Inject()
    maleLion: MaleLion;

    @Inject({ lazy: true })
    femaleLion: FemaleLion;
}
