import { of, by, AUTO, DependencyConfig } from '../src';
import { MushroomService, Injectable, registerDepsConfig } from '../src';
import { Message } from '../src/utils/message';
import { Animal, BrownBear, ErrorZoo, Zoo } from './test-classes/basicClasses';
import { BrownBears } from './test-classes/basicClasses';
import { ClassesConfig, useFood, useMonkey } from './test-classes/classesConfig';
import {
    Banana,
    BrownMonkey,
    ColorPig,
    Corn,
    CounterfeitMonkey,
    GoldMonkey,
    Kangaroo,
    Monkey,
    MonkeyChief,
    MonkeyKing,
    Monkeys,
    Peach,
    Pig,
    RedMonkey,
    RedPig,
    YellowMonkey
} from './test-classes/configedClasses';

Message.toggleConsolePrintable(false);

registerDepsConfig(ClassesConfig);

const mushroomService = of(MushroomService);

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
    mushroomService.destroySingletonInstance(BrownBear);
    const brownBear2 = by(BrownBear, 1);

    expect(brownBear1 === brownBear2).toBe(false);
});

test('带参数的构造方法', () => {
    mushroomService.destroySingletonInstance(BrownBear);
    const brownBear = by(BrownBear, 12);
    expect(brownBear.age).toBe(12);

    const zoo1 = by(Zoo, AUTO, AUTO);
    expect(zoo1.brownBear && zoo1.brownBear instanceof BrownBear).toBe(true);

    mushroomService.destroySingletonInstance(Zoo);
    const zoo2 = by(Zoo, AUTO, null);
    expect(zoo2.brownBear && zoo2.brownBear instanceof BrownBear && zoo2.brownBears === null).toBe(true);
});

test('AUTO参数', () => {
    mushroomService.destroySingletonInstance(Zoo);
    const zoo1 = by(Zoo, null);
    expect(zoo1.brownBear === null && zoo1.brownBears && zoo1.brownBears instanceof BrownBears).toBe(true);

    mushroomService.destroySingletonInstance(Zoo);
    const zoo2 = by(Zoo, AUTO, null);
    expect(zoo2.brownBear && zoo2.brownBear instanceof BrownBear && zoo2.brownBears === null).toBe(true);

    mushroomService.destroySingletonInstance(Zoo);
    const zoo3 = by(Zoo, null, AUTO);
    expect(zoo3.brownBear === null && zoo3.brownBears && zoo3.brownBears instanceof BrownBears).toBe(true);

    mushroomService.destroySingletonInstance(Zoo);
    const zoo4 = by(Zoo, AUTO, AUTO);
    expect(
        zoo4.brownBear && zoo4.brownBear instanceof BrownBear && zoo4.brownBears && zoo4.brownBears instanceof BrownBears
    ).toBe(true);

    mushroomService.destroySingletonInstance(Zoo);
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    by(Zoo, AUTO, AUTO, AUTO);
    expect(messageHistory[0].code).toBe('20001');
    expect(messageHistory[1].code).toBe('20002');

    Message.clearHistory();
    by(Zoo, null, null, null);
    expect(messageHistory[0].code).toBe('20002');
    expect(messageHistory.length).toBe(1);

    mushroomService.destroySingletonInstance(Zoo);
    Message.clearHistory();
    by(Zoo, null, null, null);
    expect(messageHistory[0].code).toBe('20001');
    expect(messageHistory[1].code).toBe('20002');
});

test('创建实例失败抛异常', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    try {
        of(ErrorZoo);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('39001');
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

test('带配置的依赖配置回调方法', () => {
    of(MonkeyKing, MonkeyKing, MonkeyKing);
    of(Monkeys, Monkeys, Monkeys);

    expect(ClassesConfig.monkeyKingCreateCount).toBe(1);
    expect(ClassesConfig.monkeyKingFetchCount).toBe(3);
    expect(ClassesConfig.monkeysCreateCount).toBe(3);
    expect(ClassesConfig.monkeysFetchCount).toBe(3);
});

test('带配置的依赖配置非子类实例', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    expect(ClassesConfig.afterInstanceFetchLaunched).toBe(false);
    by(CounterfeitMonkey, new CounterfeitMonkey());
    expect(ClassesConfig.afterInstanceFetchLaunched).toBe(true);

    try {
        of(CounterfeitMonkey);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29002');
});

test('配置局部范围内单例', () => {
    const huashanMonkeyChief1 = by(MonkeyChief, 'Huashan');
    const huashanMonkeyChief2 = by(MonkeyChief, 'Huashan');

    const taishanMonkeyChief = by(MonkeyChief, 'Taishan');

    expect(huashanMonkeyChief1 === huashanMonkeyChief2).toBe(true);
    expect(huashanMonkeyChief1 === taishanMonkeyChief).toBe(false);
});

test('深度查找配置', () => {
    const pig1 = by(Pig, false);
    expect(pig1 && pig1 instanceof RedPig).toBe(true);
    expect(pig1.age).toBe(2);

    const pig2 = by(Pig, true);
    expect(pig2 && pig2 instanceof ColorPig && !(pig2 instanceof RedPig)).toBe(true);
    expect(pig2.age).toBe(1);
});

test('重复配置提示', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    class ClassesDuplicateConfig {
        @DependencyConfig(Kangaroo)
        static configKangaroo() {}

        @DependencyConfig(Kangaroo)
        static configKangarooDuplicate() {}
    }

    expect(messageHistory[0].code).toBe('20003');
});

test('Message打印错误', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    Message.error('11000', '测试打印错误');

    expect(messageHistory[0].code).toBe('11000');
});
