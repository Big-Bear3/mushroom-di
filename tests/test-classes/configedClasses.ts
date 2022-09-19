import { Injectable } from '../../src';

@Injectable()
export class Food {}

@Injectable()
export class Banana extends Food {}

@Injectable()
export class Corn extends Food {
    constructor(public count: number, public location: string, public previous: Banana) {
        super();
    }
}

@Injectable()
export class Peach extends Food {}

@Injectable()
export class Monkey {
    public color: string;
    public food: Food;
}

@Injectable({ type: 'singleton' })
export class RedMonkey extends Monkey {
    color = 'red';

    constructor(public food: Food) {
        super();
    }
}

@Injectable({ type: 'multiple' })
export class YellowMonkey extends Monkey {
    color = 'yellow';

    constructor(public food: Food) {
        super();
    }
}

@Injectable({ type: 'multiple' })
export class BrownMonkey extends Monkey {
    color = 'brown';

    constructor(public food: Food) {
        super();
    }
}

export class GoldMonkey extends Monkey {}
