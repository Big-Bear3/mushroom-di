import { Inject, Injectable } from '../../src';

@Injectable()
export class BlackRabbit {
    name = 'blackRabbit';
}

@Injectable()
export class WhiteRabbit {
    name = 'whiteRabbit';
}

@Injectable()
export class Tiger {
    name = 'tiger';
}

@Injectable()
export class Fox {
    @Inject()
    static partner: Tiger;

    @Inject(Tiger, { lazy: true })
    static lazyPartner: Tiger;

    @Inject()
    friend: BlackRabbit;
}

@Injectable()
export class WhiteFox extends Fox {
    constructor(public food: BlackRabbit) {
        super();
    }
}

@Injectable({ injectOnNew: true })
export class RedFox extends Fox {
    static id = 1234;

    static set myId(value) {
        RedFox.id = value;
    }

    static get myId() {
        return RedFox.id;
    }

    @Inject()
    static partner: Tiger;

    @Inject()
    girlFriend: WhiteFox;

    constructor(public friend1?: BlackRabbit, public friend2?: WhiteRabbit) {
        super();
    }

    static changeId() {
        RedFox.id = 4321;
    }
}
