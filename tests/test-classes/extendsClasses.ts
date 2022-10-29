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
    @Inject(Grass, { lazy: true })
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

    @Inject(Earth)
    static planet3: Earth;

    @Inject(Mars, { lazy: true })
    static planet4: Mars;
}

@Injectable()
export class Lion extends Animal {
    @Inject()
    foodType: Meat;
}

@Injectable()
export class MaleLion extends Lion {
    @Inject(DeerMeat)
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

    @Inject({ lazy: true })
    anyMember: any;

    @Inject(null)
    nullMember1: MaleLion;

    @Inject(null, { lazy: true })
    nullMember2: MaleLion;

    @Inject({ lazy: true })
    static anyStaticMember: any;

    @Inject(null)
    static nullStaticMember1: MaleLion;

    @Inject(null, { lazy: true })
    static nullStaticMember2: MaleLion;

    @Inject({ lazy: true })
    maleLionValue: MaleLion;

    @Inject({ lazy: true })
    static maleLionStaticValue: MaleLion;
}
