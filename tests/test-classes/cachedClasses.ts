import type { ObjectType } from '../../src/types/diTypes';

import { Injectable } from '../../src/decorators/injectable';

@Injectable({
    type: 'cached'
})
export class Squirrel {
    private memory: string[];

    constructor() {
        this.memory = [];
        for (let i = 0; i < 100000; i++) {
            this.memory.push(Math.random() + '');
        }
    }
}

@Injectable<BlackSquirrel>({
    type: 'cached',
    follow: function () {
        return this.following;
    }
})
export class BlackSquirrel {
    constructor(public following: ObjectType) {}
}

@Injectable<GreenSquirrel>({
    type: 'cached',
    follow: function () {
        return null;
    }
})
export class GreenSquirrel {}

@Injectable<AquaSquirrel>({
    type: 'cached',
    follow: function () {
        return 'str' as any;
    }
})
export class AquaSquirrel {}
