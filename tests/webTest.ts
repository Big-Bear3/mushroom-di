import { CircularClassA, CircularClassB, CircularClassC } from './test-classes/circularClasses';
import { Zoo } from './test-classes/basicclasses';

export function test(): void {
    // const zoo = of(Zoo);
    // const zooError = by(Zoo, 11, 1, 1, 1, 1, 1);

    of(CircularClassA);
    of(CircularClassB);
    of(CircularClassC);
}

test();
