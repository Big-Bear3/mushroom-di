# mushroom-di
## 安装
1. 安装依赖包
```
npm i mushroom-di
```
2. 在tsconfig.json中配置如下属性：
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
"useDefineForClassFields": false,
```
## 基本用法
### of() 方法与 @Injectable() 装饰器
首先我们需要一个用于创建实例的类，并将其用 **@Injectable()** 装饰器装饰：
```
@Injectable()
export class Bee {
    name = 'bee';

    constructor() {}
}
```

再在程序的入口使用 **of()** 方法，获取该类的实例（依赖）：
```
const bee = of(Bee);
```
这样我们就通过 **mushroom** 的依赖查找功能，得到了该类的实例（依赖）。我们还可以通过 **of()** 方法一次性获得多个依赖：
```
const [bee1, bee2, bee3, ...] = of(Bee1, Bee2, Bee3, ...);
```

### 单例与多例
或许我们在项目中需要一些单例的依赖，我们可以为 **@Injectable()** 传入一个 **type** 参数，**mushroom** 将会控制这个类创建出的实例是单例的还是多例的：
```
@Injectable({ type: 'singleton' })
export class Bee {
    name = 'bee';

    constructor() {}
}

@Injectable({ type: 'multiple' })
export class Bee {
    name = 'bee';

    constructor() {}
}
```
如果不传，默认为多例。

### 使用 @Inject() 装饰器为成员变量注入
上面介绍的使用 **of()** 获取实例为依赖查找的方式，您可以在任何地方使用它。现在我们来介绍一下依赖注入的方式，但依赖注入只能在类中使用。
首先我们再创建一个类Honey，用于将其实例注入到Bee类的实例中:
```
@Injectable()
export class Honey {
    honeyType = 'Jujube honey';
}
```
在Bee类中使用@Inject()装饰器，将依赖注入到成员变量 "honey" 上：
```
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject()
    honey: Honey;

    constructor() {}
}
```
这样，在我们使用 **of()** 获取Bee的实例时，**mushroom** 会自动将Honey的实例注入到Bee的实例中：
```
const bee = of(Bee);
console.log(bee.honey.honeyType); // "Jujube honey"
```

### 构造方法注入
除了用 **@Inject()** 装饰器，我们还可以通过构造方法注入依赖：
```
@Injectable()
export class Bee {
    name = 'bee';

    constructor(public honey1: Honey, public honey2: Honey) {}
}
```
```
const bee = of(Bee);
console.log(bee.honey1.honeyType); // "Jujube honey"
console.log(bee.honey2.honeyType); // "Jujube honey"
```
### 使用 by() 方法为依赖的构造方法传递参数
少数情况下，我们需要创建构造方法带参数的依赖，我们可以使用 **mushroom** 提供的 **by()** 方法：
```
@Injectable()
export class Bee {
    private name: string;

    constructor(code: string) {
        this.name = 'bee' + code;
    }

    getName(): string {
        return this.name;
    }
}
```
```
const bee = by(Bee, 123);
console.log(bee.getName()); // "bee123"
```

## 高级用法
### 使用DependencyConfig() 装饰器、与依赖配置
我们可以通过 **DependencyConfig()** 装饰器装饰自定义方法，来配置被依赖的类如何创建实例：
```
@Injectable()
export class Bee {
    private name: string;

    location: string;

    constructor(code: string) {
        this.name = 'bee' + code;
    }

    getName(): string {
        return this.name;
    }
}

@Injectable()
export class HoneyBee extends Bee {
    location = 'Jungle';

    constructor(code: string) {
        super(code);
    }
}


@Injectable()
export class Hornet extends Bee {
    location = 'Forest';

    constructor(code: string) {
        super(code);
    }
}
```
```
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee(configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = HoneyBee;
        configEntity.args = ['520'];
    }
}
```
当然，您还需要使用 **mushroom** 提供的 **registerDepsConfig** 方法，在您程序的入口去注册该配置类：
```
registerDepsConfig(BeeConfig);
```
运行结果：
```
const bee = of(Bee);
console.log(bee instanceof HoneyBee); // true
console.log(bee.getName()); // "bee520"
console.log(bee.location); // "Jungle"
```
您还可以在配置方法中直接返回要使用的实例：
```
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee() {
        return by(Hornet, 999);
    }
}
```
```
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee.getName()); // bee999
console.log(bee.location); // Forest
```
该配置是一种深度的配置，如果当前配置指定了usingClass，则 **mushroom** 还会继续查找本次usingClass的指定的配置进行进一步的配置，直到最后两次配置指定的usingClass一致为止。
```
@Injectable()
export class FierceHornet extends Hornet {
    location = 'Rainforest';

    constructor(code: string) {
        super(code);
    }
}

export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee(configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = Hornet;
    }

    @DependencyConfig(Hornet)
    private static configHornet(configEntity: DependencyConfigEntity<typeof Hornet | typeof FierceHornet>) {
        configEntity.usingClass = FierceHornet;
    }
}
```
```
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee instanceof FierceHornet); // true
```
如若不想继续深度查找配置，可以在配置方法中返回 **mushroom** 提供的 **STOP_DEEP_CONFIG** symbol常量，来阻止继续深度查找配置：
```
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee(configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = Hornet;

        return STOP_DEEP_CONFIG;
    }

    @DependencyConfig(Hornet)
    private static configHornet(configEntity: DependencyConfigEntity<typeof Hornet | typeof FierceHornet>) {
        configEntity.usingClass = FierceHornet;
    }
}
```
```
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee instanceof FierceHornet); // false
```










