import { of } from '../src';
import { Message } from '../src/utils/message';
import {
    Animal,
    Grassland,
    Earth,
    Mars,
    DeerMeat,
    RabitMeat,
    Meat,
    FemaleLion,
    SolarSystem
} from './test-classes/extendsClasses';

Message.toggleConsolePrintable(false);

test('静态成员变量注入', () => {
    expect(Animal.planet1 && Animal.planet1 instanceof Earth).toBe(true);
    expect(Animal.planet2 && Animal.planet2 instanceof Mars).toBe(true);
    expect(Animal.planet1 === Animal.planet1).toBe(true);
    expect(Animal.planet2 === Animal.planet2).toBe(true);
});

test('成员变量注入', () => {
    const grassland1 = of(Grassland);
    const grassland2 = of(Grassland);

    expect(!!grassland1.maleLion).toBe(true);
    expect(!!grassland1.femaleLion).toBe(true);

    expect(grassland1.maleLion.food && grassland1.maleLion.food instanceof DeerMeat).toBe(true);
    expect(grassland1.femaleLion.food && grassland1.femaleLion.food instanceof RabitMeat).toBe(true);

    expect(grassland1.maleLion.food === grassland2.maleLion.food).toBe(true);
    expect(grassland1.femaleLion.food === grassland2.femaleLion.food).toBe(false);
});

test('父类成员变量注入', () => {
    const grassland = of(Grassland);

    expect(grassland.maleLion.foodType && grassland.maleLion.foodType instanceof Meat).toBe(true);
    expect(grassland.femaleLion.foodType && grassland.femaleLion.foodType instanceof Meat).toBe(true);
});

test('静态成员变量延迟注入', () => {
    Mars.initedFlag = false;

    expect(SolarSystem.planet && SolarSystem.planet instanceof Mars).toBe(true);
    expect(Mars.initedFlag).toBe(true);
});

test('成员变量延迟注入', () => {
    FemaleLion.initedFlag = false;

    const grassland = of(Grassland);
    expect(grassland.femaleLion && grassland.femaleLion instanceof FemaleLion).toBe(true);
    expect(FemaleLion.initedFlag).toBe(true);
});
