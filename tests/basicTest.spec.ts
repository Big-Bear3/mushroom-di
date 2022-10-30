import { of, by, AUTO, DependencyConfig } from '../src';
import { MushroomService, Injectable, registerDepsConfig } from '../src';
import { Message } from '../src/utils/message';
import {
    Animal,
    BrownBear,
    ErrorZoo,
    Fox,
    InvalidConfigZoo1,
    InvalidConfigZoo2,
    InvalidConfigZoo3,
    InvalidConfigZoo4,
    InvalidConfigZoo5,
    InvalidConfigZoo6,
    Penguin,
    PolarBear,
    Zoo
} from './test-classes/basicClasses';
import { BrownBears } from './test-classes/basicClasses';
import { AquaSquirrel, BigSquirrel, BlackSquirrel, GreenSquirrel, Squirrel } from './test-classes/cachedClasses';
import { CachedClassesConfig, ClassesConfig, useFood, useMonkey } from './test-classes/classesConfig';
import {
    Banana,
    BrownMonkey,
    ColorPig,
    Corn,
    CounterfeitMonkey,
    GoldMonkey,
    Kangaroo,
    Monkey,
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

    const squirrel1 = of(Squirrel);
    const squirrel2 = of(Squirrel);
    expect(squirrel1 === squirrel2).toBe(true);
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

test('清除已创建的单例、或缓存的对象', () => {
    const brownBear1 = by(BrownBear, 1);
    mushroomService.destroySingletonInstance(BrownBear);
    const brownBear2 = by(BrownBear, 1);

    expect(brownBear1 === brownBear2).toBe(false);

    const squirrel1 = of(Squirrel);
    mushroomService.destroyCachedInstance(Squirrel);
    const squirrel2 = of(Squirrel);

    expect(squirrel1 === squirrel2).toBe(false);
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

    const blackSquirrel = by(BlackSquirrel, { a: 1 });
    expect(blackSquirrel.following.a).toBe(1);
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
});

test('创建实例失败抛异常', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    try {
        of(ErrorZoo);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('39001');
});

test('非法的follow返回值', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        of(GreenSquirrel);
    } catch (error) {}

    try {
        of(AquaSquirrel);
    } catch (error) {}

    expect(messageHistory[0].code).toBe('29007');
    expect(messageHistory[1].code).toBe('29008');
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
    of(BigSquirrel);

    expect(ClassesConfig.monkeyKingCreateCount).toBe(1);
    expect(ClassesConfig.monkeyKingFetchCount).toBe(3);
    expect(ClassesConfig.monkeysCreateCount).toBe(3);
    expect(ClassesConfig.monkeysFetchCount).toBe(3);
    expect(CachedClassesConfig.bigSquirrelCreateTimes).toBe(1);
    expect(CachedClassesConfig.bigSquirrelFetchTimes).toBe(1);

    of(BigSquirrel);
    expect(CachedClassesConfig.bigSquirrelCreateTimes).toBe(1);
    expect(CachedClassesConfig.bigSquirrelFetchTimes).toBe(2);
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

test('无效的配置验证', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();

    try {
        of(InvalidConfigZoo1);
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29014');

    Message.clearHistory();

    try {
        of(InvalidConfigZoo2);
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29014');

    Message.clearHistory();

    try {
        of(InvalidConfigZoo3);
    } catch (error) {}
    expect(messageHistory).toHaveLength(0);

    Message.clearHistory();

    try {
        of(InvalidConfigZoo4);
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29015');

    Message.clearHistory();

    try {
        of(InvalidConfigZoo5);
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29016');

    Message.clearHistory();

    try {
        of(InvalidConfigZoo6);
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29017');
});

test('不支持WeakRef的情况下创建实例', () => {
    const weakRefTmp = WeakRef;
    WeakRef = undefined;

    mushroomService.destroyCachedInstance(Squirrel);

    const squirrel1 = of(Squirrel);
    const squirrel2 = of(Squirrel);
    expect(!!squirrel1 && squirrel1 === squirrel2).toBe(true);

    mushroomService.destroyCachedInstance(Squirrel);

    const squirrel3 = of(Squirrel);
    expect(!!squirrel3 && squirrel1 === squirrel3).toBe(false);

    mushroomService.destroyCachedInstance(Squirrel);
    WeakRef = weakRefTmp;
});

test('对象置为sealed或frozen', () => {
    const fox = of(Fox);
    const penguin = of(Penguin);
    const polarBear = of(PolarBear);

    try {
        fox.food = 'mouse';
        (<any>fox).color = 'black';
    } catch (error) {}

    expect(fox.food).toBe('mouse');
    expect((<any>fox).color).toBe(undefined);

    delete fox.food;
    expect(fox.food).toBe(undefined);

    try {
        delete penguin.food;
    } catch (error) {}

    expect(penguin.food).toBe('fish');

    try {
        polarBear.food = 'mouse';
    } catch (error) {}
    expect(polarBear.food).toBe('fish');
    expect(polarBear.friend2 instanceof BrownBear).toBe(true);

    const messageHistory = Message.getHistory();
    Message.clearHistory();
    try {
        polarBear.friend2 = null;
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29019');

    Message.clearHistory();
    try {
        PolarBear.friend1 = null;
    } catch (error) {}
    expect(messageHistory[0].code).toBe('29020');
});

test('Message打印错误', () => {
    const messageHistory = Message.getHistory();
    Message.clearHistory();
    Message.error('11000', '测试打印错误');

    expect(messageHistory[0].code).toBe('11000');
});
