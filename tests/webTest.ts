import { CircularClassA, CircularClassB, CircularClassC, CircularClassE } from './test-classes/circularClasses';
import { BrownBear, Zoo } from './test-classes/basicClasses';

export function test(): void {
    try {
        const a = of(BrownBear);
    } catch (error) {
        debugger;
    }
}

test();
