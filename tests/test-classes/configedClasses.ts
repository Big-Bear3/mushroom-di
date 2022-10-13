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

@Injectable({ type: 'singleton' })
export class MonkeyKing {}

@Injectable({ type: 'multiple' })
export class Monkeys {}

@Injectable()
export class MonkeyChief {
    location: string;

    constructor(location: string) {
        this.location = location;
    }
}

@Injectable()
export class YellowMonkeyChief {
    info: { location: string };

    constructor(info: { location: string }) {
        this.info = info;
    }
}

@Injectable()
export class CounterfeitMonkey {
    constructor() {}
}

@Injectable()
export class Pig {
    constructor(public age: number) {}
}

@Injectable()
export class ColorPig extends Pig {
    constructor(public age: number) {
        super(age);
    }
}

@Injectable()
export class RedPig extends ColorPig {
    constructor(public age: number) {
        super(age);
    }
}

@Injectable()
export class Kangaroo {}
