import { of, by, AUTO } from '../src';
import { destroySingletonInstance, Injectable, registerDepsConfig } from '../src';
import { Message } from '../src/utils/message';
import { Animal, BrownBear, Zoo } from './test-classes/basicClasses';
import { BrownBears } from './test-classes/basicClasses';
import { ClassesConfig, useFood, useMonkey } from './test-classes/classesConfig';
import { Banana, BrownMonkey, Corn, GoldMonkey, Monkey, Peach, RedMonkey, YellowMonkey } from './test-classes/configedClasses';

Message.toggleConsolePrintable(false);

registerDepsConfig(ClassesConfig);

test('单例多例', () => {
    const brownBear1 = of(BrownBear);
    const brownBear2 = of(BrownBear);
    expect(brownBear1 === brownBear2).toBe(true);

    const brownBears1 = of(BrownBears);
    const brownBears2 = of(BrownBears);
    expect(brownBears1 === brownBears2).toBe(false);

    const animal1 = of(Animal);
    const animal2 = of(Animal);
    expect(animal1 === animal2).toBe(false);
});

test('继承单例抛异常', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        @Injectable()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class BrownBearChild extends BrownBear {}
    } catch (error) {}

    expect(messageHistory[0]?.code).toBe('29001');
});

test('清除已创建的单例对象', () => {
    const brownBear1 = by(BrownBear, 1);
    destroySingletonInstance(BrownBear);
    const brownBear2 = by(BrownBear, 1);

    expect(brownBear1 === brownBear2).toBe(false);
});

test('带参数的构造方法', () => {
    destroySingletonInstance(BrownBear);
    const brownBear = by(BrownBear, 12);
    expect(brownBear.age).toBe(12);

    const zoo1 = by(Zoo, AUTO, AUTO);
    expect(zoo1.brownBear && zoo1.brownBear instanceof BrownBear).toBe(true);

    destroySingletonInstance(Zoo);
    const zoo2 = by(Zoo, AUTO, null);
    expect(zoo2.brownBear && zoo2.brownBear instanceof BrownBear && zoo2.brownBears === null).toBe(true);
});

test('带配置的依赖', () => {
    const monkey = of(Monkey);
    expect(monkey.constructor.name).toBe('Monkey');

    useMonkey(YellowMonkey);
    const monkey2 = of(Monkey);
    const monkey3 = of(Monkey);
    expect(monkey2.color).toBe('yellow');
    expect(monkey2 === monkey3).toBe(false);

    useMonkey(RedMonkey);
    const monkey4 = of(Monkey);
    const monkey5 = of(Monkey);
    expect(monkey4.color).toBe('red');
    expect(monkey4 === monkey5).toBe(true);

    useMonkey(GoldMonkey);
    const monkey6 = of(Monkey);
    expect(monkey6.constructor.name).toBe('GoldMonkey');

    useMonkey(YellowMonkey);
    const monkey7 = by(Monkey, null);
    expect(monkey7.food).toBe(null);

    useFood(Banana);
    const monkey8 = by(Monkey, AUTO);
    expect(monkey8.food.constructor.name).toBe('Banana');

    useMonkey(RedMonkey);
    useFood(Peach);
    const monkey9 = by(Monkey, AUTO);
    expect(monkey9.food.constructor.name).toBe('Food');

    useMonkey(BrownMonkey);
    const monkey10: BrownMonkey = by(Monkey, AUTO);
    expect(monkey10.food.constructor.name).toBe('Corn');
    expect((monkey10.food as Corn).count).toBe(100);
    expect((monkey10.food as Corn).location).toBe('Beijing');
    expect((monkey10.food as Corn).previous.constructor.name).toBe('Banana');
});
