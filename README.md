## 为什么需要Mushroom？
在Typescript项目中，我们维护有状态的对象时，面向对象（Class）比面向函数会更加有优势。
1. 功能性  
    在Typescript的类中，照比只使用函数，我们可以拥有更多的功能，如访问修饰符、访问器、继承、实现接口等，这些可以使我们程序的灵活性，健壮性更好，条理更清晰。
2. 简洁性、易用性  
    在只使用函数时，维护有状态的对象，我们往往需要利用闭包：
```
export function useStateManager() {
    let state: any;

    function setState(newState: any): void {
        state = newState;
    }

    function getState(): any {
        return state;
    }

    function stateIsEqual(myState: any): boolean {
        return state === myState;
    }

    return {
        setState,
        getState,
        stateIsEqual
    };
}

const { setState, getState, stateIsEqual } = useStateManager();
```
是不是看起来比较熟悉？在Vue3的项目中，<script setup>标签解决了在vue文件中多余的return问题，但是这些use函数中，您依然需要返回。而且在vscode代码跟踪上（ctrl+左键点击变量）也有问题。    
我们可以使用类来解决这些问题：
```
export class StateManager {
    private state: any;

    setState(newState: any): void {
        this.state = newState;
    }

    getState(): any {
        return this.state;
    }

    stateIsEqual(myState: any): boolean {
        return this.state === myState;
    }
}  
    
const { setState, getState, stateIsEqual } = new StateManager();
```
这样就简洁多了，而且性能要比闭包的方式好一些。不过这个类的实例是需要new出来的，这非常不利于我们控制如何去new，以及对这些new出来的实例（依赖）进行管理。  
  
[**Mushroom**](https://github.com/Big-Bear3/mushroom-di) 为创建、管理、维护（Ioc、DI）这些依赖提供了完整的解决方案。如：单例、多例的控制，依赖创建的参数配置、使用子类（多态）的配置，依赖查找与自动注入等等。  
  
下面本文将会由浅至深地介绍 **Mushroom** 这款依赖注入工具。

## Mushroom适合什么样的开发者？
1. 对面向对象程序设计有一定的了解
2. 对Typescript有一定的使用经验
3. 对程序的设计原则有一定的了解

## 运行环境
**需要支持Map、WeakMap；**  
**需要支持reflect-metadata；**  
  
*注：由于用Vite使用esbuild将TypeScript转译到JavaScript，esbuild还不支持reflect-metadata，可以参照以下方式去解决：
```
npm i -D rollup-plugin-swc3
```
```
import { swc } from "rollup-plugin-swc3";

export default defineConfig({
  ...
  plugins: [
    ...
    swc({
      jsc: {
        parser: {
          syntax: "typescript",
          // tsx: true, // If you use react
          dynamicImport: false,
          decorators: true,
        },
        target: "es2021",
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
  esbuild: false,
  ...
});

```

## 安装
1. 安装依赖包
```
npm i -S mushroom-di
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
这样我们就通过 **Mushroom** 的依赖查找功能，得到了该类的实例（依赖）。我们还可以通过 **of()** 方法一次性获得多个依赖：
```
const [bee1, bee2, bee3, ...] = of(Bee1, Bee2, Bee3, ...);
```

### 单例与多例
或许我们在项目中需要一些单例的依赖，我们可以为 **@Injectable()** 传入一个 **type** 参数，**Mushroom** 将会控制这个类创建出的实例是单例的还是多例的：
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
单例依赖一旦创建就会放入 **Mushroom** 容器中，之后将一直使用这个依赖，不会重新创建。当我们需要将 **Mushroom** 容器中的单例依赖销毁，让下一次重新创建时，可以调用 **destroySingletonInstance()** 方法来销毁 **Mushroom** 容器中保存的实例：
```
destroySingletonInstance(Bee);
```

### 使用 @Inject() 装饰器为成员变量注入依赖
上面介绍的使用 **of()** 获取实例为依赖查找的方式，您可以在任何地方使用它。现在我们来介绍一下依赖注入的方式，但依赖注入只能在类中使用。  
首先我们再创建一个类Honey，用于将其实例注入到Bee类的实例中:
```
@Injectable()
export class Honey {
    honeyType = 'Jujube honey';
}
```
在Bee类中使用 **@Inject()** 装饰器，将依赖注入到成员变量 "honey" 上：
```
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject()
    honey: Honey;

    constructor() {}
}
```
这样，在我们使用 **of()** 获取Bee的实例时，**Mushroom** 会自动将Honey的实例注入到Bee的实例中：
```
const bee = of(Bee);
console.log(bee.honey.honeyType); // "Jujube honey"
```
**@Inject()** 装饰器也可以装饰静态成员变量：
```
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject()
    static honey: Honey;

    constructor() {}
}
```
```
console.log(Bee.honey.honeyType); // "Jujube honey"
```
如果您想依赖接口，可以采用下面这种写法：
```
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject(Honey)
    static honey: IHoney; // IHoney为接口

    constructor() {}
}
```

<a id="vite-attention"></a>
### 通过构造方法注入依赖
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
少数情况下，我们需要创建构造方法带参数的依赖，我们可以使用 **Mushroom** 提供的 **by()** 方法：
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
如果第一个参数需要自动注入，第二个参数需要传入参数，则可以使用 **Mushroom** 提供的 **AUTO** symbol常量：
```
@Injectable()
export class Bee {
    private name: string;

    constructor(private honey: Honey, code: string) {
        this.name = 'bee' + code;
    }

    getName(): string {
        return this.name;
    }
}
```
```
const bee = by(Bee, AUTO, 123);
```

## 高级用法
### 使用DependencyConfig() 装饰器进行依赖配置
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
当然，您还需要使用 **Mushroom** 提供的 **registerDepsConfig** 方法，在您程序的入口去注册该配置类：
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
该配置是一种深度的配置，如果当前配置指定了usingClass，则 **Mushroom** 还会继续查找本次usingClass的指定的配置进行进一步的配置，直到最后两次配置指定的usingClass一致为止。
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
如若不想继续深度查找配置，可以在配置方法中返回 **Mushroom** 提供的 **STOP_DEEP_CONFIG** symbol常量，来阻止继续深度查找配置：
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

### 任意参数的 by() 方法
```
您可以利用 **by()** 方法，传递一个标识给依赖配置方法，去告知其如何配置依赖：
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee(
        configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet, [{ flag: number }]>
    ) {
        if (configEntity.args[0].flag === 1) {
            configEntity.usingClass = HoneyBee;
        } else {
            configEntity.usingClass = Hornet;
        }
    }
}
```
```
const bee1 = by(Bee, { flag: 1 }); // HoneyBee
const bee2 = by(Bee, { flag: 0 }); // Hornet
```
如果您需要在某个范围内控制依赖的单例，这将会很有用！

### 延迟注入
有时我们为了提升实例的初始化性能，可以为 **@Inject()** 装饰器传入 **{lazy: true}** 参数实现延迟注入：
```
@Injectable()
export class Bee {
    name = 'bee';

    @Inject({ lazy: true })
    honey: Honey;

    constructor() {}
}
```
```
const bee = of(Bee); // 这时bee.honey还未注入
const honey = bee.honey; // 获取bee.honey，会触发注入
console.log(honey);
```

### 循环依赖
**Mushroom** 提供了循环依赖检测机制，如果在依赖的创建过程中产生了循环依赖，会有错误提示：
```
@Injectable()
export class Bee1 {
    name = 'bee1';

    bee2: Bee2;

    constructor() {
        this.bee2 = of(Bee2);
    }
}

@Injectable()
export class Bee2 {
    name = 'bee2';

    bee3: Bee3;

    constructor() {
        this.bee3 = of(Bee3);
    }
}

@Injectable()
export class Bee3 {
    name = 'bee3';

    bee1: Bee1;

    constructor() {
        this.bee1 = of(Bee1);
    }
}
```
```
const bee = of(Bee1); // Error: (39002) 检测到循环依赖：Bee1 -> Bee2 -> Bee3 -> Bee1
```
解决方式大致有2种：
1. 在使用该依赖的时候再通过 **of()** 或 **by()** 方法创建该依赖： （这里用setTimeout()来表示使用时）
```
@Injectable()
export class Bee1 {
    name = 'bee1';

    bee2: Bee2;

    constructor() {
        this.bee2 = of(Bee2);
    }
}

@Injectable()
export class Bee2 {
    name = 'bee2';

    bee3: Bee3;

    constructor() {
        this.bee3 = of(Bee3);
    }
}

@Injectable()
export class Bee3 {
    name = 'bee3';

    bee1: Bee1;

    constructor() {
        setTimeout(() => {
            this.bee1 = of(Bee1);
        });
    }
}
```
2. 使用延迟注入：
```
@Injectable()
export class Bee1 {
    name = 'bee1';

    bee2: Bee2;

    constructor() {
        this.bee2 = of(Bee2);
    }
}

@Injectable()
export class Bee2 {
    name = 'bee2';

    bee3: Bee3;

    constructor() {
        this.bee3 = of(Bee3);
    }
}

@Injectable()
export class Bee3 {
    name = 'bee3';

    @Inject({ lazy: true })
    bee1: Bee1;

    constructor() {}
}
```
在程序中应尽量避免循环依赖，如若遇到循环依赖，首先您应该考虑的是，是否程序设计出了问题，或者是bug，其次才是用技术手段解决它。






