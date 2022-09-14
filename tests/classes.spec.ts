import { Injectable } from '../src/index';

@Injectable()
export class Animal {
    name = 'Animal Class';
}

@Injectable()
export class Bear {
    name = 'Bear Class';
}

@Injectable()
export class BrownBear {
    name = 'BrownBear Class';
}

@Injectable({ type: 'multiple' })
export class Animals {
    name = 'Animals Class';
}

@Injectable({ type: 'multiple' })
export class Bears {
    name = 'Bears Class';
}

@Injectable({ type: 'multiple' })
export class BrownBears {
    name = 'BrownBears Class';
}

@Injectable({ type: 'singleton' })
export class Zoo {
    name = 'Zoo Class';

    private brownBears: BrownBears;

    constructor(private brownBear: BrownBear, brownBears: BrownBears) {
        this.brownBears = brownBears;
    }

    log() {
        console.log(this.brownBear, this.brownBears);
    }
}
