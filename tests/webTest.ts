import { CircularClassA, CircularClassB, CircularClassC, CircularClassE } from './test-classes/circularClasses';
import { Zoo } from './test-classes/basicClasses';

export function test(): void {
    try {
        const a = of(CircularClassA);
    } catch (error) {
        debugger;
    }
}

test();
