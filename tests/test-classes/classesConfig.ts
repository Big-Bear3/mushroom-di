import type { Class } from '../../src/types/diTypes';

import { DependencyConfig, MushroomService, of } from '../../src';
import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import {
    Banana,
    BrownMonkey,
    ColorPig,
    Corn,
    CounterfeitMonkey,
    Food,
    GoldMonkey,
    Monkey,
    MonkeyChief,
    MonkeyKing,
    Monkeys,
    Peach,
    Pig,
    RedMonkey,
    RedPig,
    YellowMonkey,
    YellowMonkeyChief
} from './configedClasses';
import { STOP_DEEP_CONFIG } from '../../src/constants/diConstants';

let usingFood: any = Food;
let usingMonkey: any = Monkey;

export function useFood(food: typeof Food | typeof Banana | typeof Peach): void {
    usingFood = food;
}

export function useMonkey(monkey: typeof Monkey | typeof RedMonkey | typeof YellowMonkey | typeof GoldMonkey): void {
    usingMonkey = monkey;
}

export class ClassesConfig {
    @DependencyConfig(Food)
    static configFood(
        configEntity: DependencyConfigEntity<typeof Food | typeof Banana | typeof Peach, any[]>,
        outerClass: Class
    ): void {
        if (outerClass === BrownMonkey) {
            configEntity.usingClass = Corn;
            configEntity.args = <any[]>[100, 'Beijing'];
        } else configEntity.usingClass = usingFood;
    }

    @DependencyConfig(Monkey)
    static configMonkey(
        configEntity: DependencyConfigEntity<typeof Monkey | typeof RedMonkey | typeof YellowMonkey | typeof GoldMonkey>
    ): void {
        configEntity.usingClass = usingMonkey;
    }

    static monkeyKingCreateCount = 0;
    static monkeyKingFetchCount = 0;
    static monkeysCreateCount = 0;
    static monkeysFetchCount = 0;

    @DependencyConfig(MonkeyKing)
    static configMonkeyKing(configEntity: DependencyConfigEntity<typeof MonkeyKing>): void {
        configEntity.afterInstanceCreate = (instance: MonkeyKing) => {
            if (!instance) throw new Error();
            ClassesConfig.monkeyKingCreateCount++;
        };
        configEntity.afterInstanceFetch = (instance: MonkeyKing, isNew: boolean) => {
            if (!instance || isNew === undefined) throw new Error();
            ClassesConfig.monkeyKingFetchCount++;
        };
    }

    @DependencyConfig(Monkeys)
    static configMonkeys(configEntity: DependencyConfigEntity<typeof Monkeys>): void {
        configEntity.afterInstanceCreate = (instance: MonkeyKing) => {
            if (!instance) throw new Error();
            ClassesConfig.monkeysCreateCount++;
        };
        configEntity.afterInstanceFetch = (instance: MonkeyKing, isNew: boolean) => {
            if (!instance || isNew === undefined) throw new Error();
            ClassesConfig.monkeysFetchCount++;
        };
    }

    static afterInstanceFetchLaunched = false;

    @DependencyConfig(CounterfeitMonkey)
    static configCounterfeitMonkey(configEntity: DependencyConfigEntity<typeof CounterfeitMonkey, [any]>) {
        configEntity.afterInstanceFetch = () => {
            ClassesConfig.afterInstanceFetchLaunched = true;
        };
        return configEntity.args[0] ? configEntity.args[0] : of(Monkeys);
    }

    @DependencyConfig(Pig)
    static configPig(configEntity: DependencyConfigEntity<typeof Pig, [boolean] | [number]>) {
        configEntity.usingClass = ColorPig;
        if (configEntity.args[0]) {
            configEntity.args = [1];
            return STOP_DEEP_CONFIG;
        }
        configEntity.args = [1];
    }

    @DependencyConfig(ColorPig)
    static configColorPig(configEntity: DependencyConfigEntity<typeof ColorPig>) {
        configEntity.usingClass = RedPig;
        configEntity.args = [2];
    }
}

export class ScopedClassesConfig {
    @DependencyConfig(MonkeyChief)
    static configMonkeyChief(configEntity: DependencyConfigEntity<typeof MonkeyChief>): void | MonkeyChief {
        const location = configEntity.args[0];
        const mushroomService = of(MushroomService);

        if (mushroomService.containsDependencyWithKey(MonkeyChief, location)) {
            return mushroomService.getDependencyByKey(MonkeyChief, location);
        } else {
            configEntity.afterInstanceCreate = (instance): void => {
                mushroomService.addDependencyWithKey(MonkeyChief, instance, location);
            };
        }
    }

    @DependencyConfig(YellowMonkeyChief)
    static configYellowMonkeyChief(configEntity: DependencyConfigEntity<typeof YellowMonkeyChief>): void | YellowMonkeyChief {
        const location = configEntity.args[0];
        const mushroomService = of(MushroomService);

        if (mushroomService.containsDependencyWithKey(YellowMonkeyChief, location)) {
            return mushroomService.getDependencyByKey(YellowMonkeyChief, location);
        } else {
            configEntity.afterInstanceCreate = (instance): void => {
                mushroomService.addDependencyWithWeakKey(YellowMonkeyChief, instance, location);
            };
            configEntity.afterInstanceFetch = (instance): void => {
                if (!instance) throw new Error();
            };
        }
    }
}
