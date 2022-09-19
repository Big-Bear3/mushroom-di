import { DependencyConfig } from '../../src';
import { DependencyConfigEntity } from '../../src/dependency-config/dependencyConfigEntity';
import { Banana, BrownMonkey, Corn, Food, GoldMonkey, Monkey, Peach, RedMonkey, YellowMonkey } from './configedClasses';

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
}
