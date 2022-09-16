import { Animal, Animals, Bear, Bears, BrownBear } from './test-classes/basicclasses';
import { BrownBears } from './test-classes/basicclasses';

test('单例多例', () => {
    const animal1 = of(Animal);
    const animal2 = of(Animal);
    expect(animal1 === animal2).toBe(true);

    const animals1 = of(Animals);
    const animals2 = of(Animals);
    expect(animals1 === animals2).toBe(false);
});

test('继承单例警告', () => {
    const brownBear1 = of(BrownBear);
    const brownBear2 = of(BrownBear);
    expect(brownBear1 === brownBear2).toBe(true);

    const brownBears1 = of(BrownBears);
    const brownBears2 = of(BrownBears);
    expect(brownBears1 === brownBears2).toBe(false);
});

test('带参数的构造方法', () => {
    const brownBear1 = of(BrownBear);
    const brownBear2 = of(BrownBear);
    expect(brownBear1 === brownBear2).toBe(true);

    const brownBears1 = of(BrownBears);
    const brownBears2 = of(BrownBears);
    expect(brownBears1 === brownBears2).toBe(false);
});
