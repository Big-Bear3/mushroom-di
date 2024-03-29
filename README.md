## 一款简洁、易上手且功能强大的依赖注入工具<br>致力于提升您在编写面向对象程序的开发体验，让您更轻松地写出符合SOLID规范的代码
## 用法风格概览
```ts
/** 在ts文件、函数中使用依赖查找 */
const instance1 = of(OneClass);
const instance2 = by(OneClass, 1, 'str'); // 带构造方法参数

patchVal('a.b.c', '123'); // 提供或更新值
takeVal('a.b.c'); // 获取值

/** 在类中使用依赖注入 */
@Injectable() // 单例：@Injectable({ type: 'singleton' })
export class MyClass {
    @Inject()  // 延迟注入：@Inject({ lazy: true })
    private instance1: OneClass; // 成员变量注入
    
    @InjectVal('a.b.c')
    private value1: string; // 注入值

    constructor(private instance2: OneClass) {} // 构造方法注入，类似于Angular
}

/** 作者微信：Lwn001 */
/** 暂不支持ES7装饰器 */
```

## 为什么需要Mushroom？
在Typescript项目中，我们维护有状态的对象时，面向对象通常比面向函数更加有优势：  
1. 功能性  
    Class提供了更多的功能，如访问修饰符、访问器、继承、实现接口等，这些可以使我们程序的灵活性，健壮性更好，条理更清晰。  
2. 简洁性、易用性  
    只使用函数，维护有状态的对象时，我们往往需要利用闭包：
```ts
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
是不是看起来比较熟悉？在Vue3的项目中，<script setup>标签解决了在vue文件中多余的return问题，但是这些use函数中依然需要返回。      
我们可以使用类来解决此问题：
```ts
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
这样就简洁多了，而且性能要比闭包的方式好一些。不过通过new的方式，我们还需要对这些实例（依赖）进行管理。  
  
[**Mushroom**](https://github.com/Big-Bear3/mushroom-di) 为创建、管理、维护（Ioc、DI）这些依赖提供了完整的解决方案。如：单例、多例的控制，依赖创建的参数、使用的子类（多态）的配置，依赖查找与自动注入依赖等等。  
  
下面本文将会由浅至深地介绍 **Mushroom** 这款依赖注入工具。

## 运行环境
**完整功能的使用需支持Map、WeakMap、TypeScript装饰器和reflect-metadata的浏览器端或Node端**  
**如不支持TypeScript装饰器和reflect-metadata，您仍可以使用函数以及指定类的方式去实现。**

*注：由于Vite使用esbuild将TypeScript转译到JavaScript，esbuild还不支持reflect-metadata，您可以参照如下方式去解决：
```bash
npm i -D rollup-plugin-swc3
```
```js
import { swc } from "rollup-plugin-swc3";

export default defineConfig({
  ...
  plugins: [
    ...
    swc({
      jsc: {
        parser: {
          syntax: "typescript",
          dynamicImport: false,
          decorators: true,
          // tsx: true,
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
```bash
npm i -S mushroom-di
```
2. 在tsconfig.json中配置如下属性：
```js
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
"useDefineForClassFields": false, // 设置为true时，将无法使用成员变量注入方式，但仍可正常使用其他注入方式。
```

## 基本用法

### of() 方法与 @Injectable() 装饰器
首先我们需要一个用于创建实例的类，并将其用 **@Injectable()** 装饰器装饰：
```ts
@Injectable()
export class Bee {
    name = 'bee';

    constructor() {}
}
```

再在程序的入口使用 **of()** 方法，获取该类的实例（依赖）：
```ts
const bee = of(Bee);
```
这样我们就通过 **Mushroom** 的依赖查找功能，得到了该类的实例（依赖）。我们还可以通过 **of()** 方法一次性获得多个依赖：
```ts
const [bee1, bee2, bee3, ...] = of(Bee1, Bee2, Bee3, ...);
```

### 使用 @Inject() 装饰器为成员变量注入依赖
上面介绍的使用 **of()** 获取实例为依赖查找的方式，我们可以在任何地方使用它。现在介绍一下在类中使用依赖注入的方式。  
首先我们再创建一个类Honey，用于将其实例注入到Bee类的实例中:
```ts
@Injectable()
export class Honey {
    honeyType = 'Jujube honey';
}
```
在Bee类中使用 **@Inject()** 装饰器，将依赖注入到成员变量 "honey" 上：
```ts
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject()
    honey: Honey;

    constructor() {}
}
```
这样，在我们使用 **of()** 获取Bee的实例时，**Mushroom** 会自动将Honey的实例注入到Bee的实例中：
```ts
const bee = of(Bee);
console.log(bee.honey.honeyType); // "Jujube honey"
```
**@Inject()** 装饰器也可以装饰静态成员变量：
```ts
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject()
    static honey: Honey;

    constructor() {}
}
```
```ts
console.log(Bee.honey.honeyType); // "Jujube honey"
```
如果我们想依赖接口，可以采用下面这种写法：
```ts
@Injectable()
export class Bee {
    name = 'bee';
    
    @Inject(Honey)
    static honey: IHoney; // IHoney为接口

    constructor() {}
}
```

### 通过构造方法注入依赖
除了用 **@Inject()** 装饰器，我们还可以通过构造方法注入依赖：
```ts
@Injectable()
export class Bee {
    name = 'bee';

    constructor(public honey1: Honey, public honey2: Honey) {}
}
```
```ts
const bee = of(Bee);
console.log(bee.honey1.honeyType); // "Jujube honey"
console.log(bee.honey2.honeyType); // "Jujube honey"
```

### 单例与多例
在项目中如果需要一些单例的依赖，我们可以为 **@Injectable()** 传入一个 **type** 参数，**Mushroom** 将会控制这个类创建出的实例是单例的还是多例的：
```ts
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
单例依赖一旦创建就会放入 **Mushroom** 容器中，之后将一直使用这个依赖，不会重新创建。当我们需要将 **Mushroom** 容器中的单例依赖销毁，让下一次重新创建时，可以调用 **MushroomService** 中的 **destroySingletonInstance()** 方法来销毁 **Mushroom** 容器中保存的实例：
```ts
const mushroomService = of(MushroomService);
mushroomService.destroySingletonInstance(Bee);
```
<a id="createCachedDependencies"></a>
### 创建带有缓存的实例（需环境支持WeakRef）
如果我们需要单例的依赖，但又不想其常驻内存，我们可以将 **@Injectable()** 中的type设置为 **cached** ，来实现这种效果：
```ts
@Injectable({ type: 'cached' })
export class Bee {
    name = 'bee';

    constructor() {}
}
```
```ts
const bee1 = of(Bee);
const bee2 = of(Bee);

console.log(bee1 === bee2) // true
```
如果bee1, bee2实例之后不会再被用到，在下次垃圾回收的时候会将其回收，在 **Mushroom** 容器中缓存的Bee的实例也一并被回收。  
这将会很有用，如果一个对象占用内存比较多，创建的代价又相对较大，推荐使用这种方式。  
更多用法可以参考后续这一章节。[链接](#cachedDependenciesAdvancedUsage)  
    
我们还可以调用 **MushroomService** 中的 **destroyCachedInstance()** 方法，手动清除实例的缓存：
```ts
const mushroomService = of(MushroomService);
mushroomService.destroyCachedInstance(Bee1);
```

### 使用函数代替 @Injectable() 装饰器
如果运行环境不支持Typescript装饰器，可以使用 **setAsInjectable()** 函数替代：
```ts
export class Bee {
    name = 'bee';
}
setAsInjectable(Bee, { type: 'singleton' })
```
或在静态代码块中调用：
```ts
export class Bee {
    name = 'bee';
    
    static {
        setAsInjectable(Bee, { type: 'singleton' })
    }
}
```

### 使用 by() 方法为依赖的构造方法传递参数
少数情况下，我们需要创建构造方法带参数的依赖，可以使用 **Mushroom** 提供的 **by()** 方法：
```ts
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
```ts
const bee = by(Bee, 123);
console.log(bee.getName()); // "bee123"
```
如果第一个参数需要自动注入，第二个参数需要传入参数，则可以使用 **Mushroom** 提供的 **AUTO** 常量：
```ts
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
```ts
const bee = by(Bee, AUTO, 123);
```

### 禁止扩展、密封和冻结依赖
我们可以为InjectableOptions传入一个setTo属性，来禁止扩展、密封或冻结依赖。
```ts
@Injectable({ setTo: 'inextensible' }) // 设为不可扩展的，相当于Object.preventExtensions
export class Bee {
    private name: string;
}

@Injectable({ setTo: 'sealed' }) // 设为密封的，相当于Object.seal
export class Bee {
    private name: string;
}

@Injectable({ setTo: 'frozen' }) // 设为冻结的，相当于Object.freeze
export class Bee {
    private name: string;
}
```

### 通过new关键字创建实例时注入依赖
某些极端场景下，我们使用new关键字创建实例时，也希望将依赖注入到该实例里：
```ts
@Injectable()
export class Honey {
    honeyType = 'Jujube honey';
}

@Injectable({ injectOnNew: true }) // 配置injectOnNew为true
export class Bee {
    @Inject()
    honey: Honey;
}

const bee = new Bee();
console.log(bee.honey.honeyType); // 'Jujube honey'
```

### 普通值的提供和注入
在我们项目中，有可能需要提供和注入一些普通值，如基本类型的值，json字面量等，这样可以使我们的程序更加轻量化。  
1. 首先我们需要通过 **MushroomService** 构建一个模块化的值结构，并且可以指定初始值，值结构为 **ModularValues** 类型：
```ts 
const modularValues: ModularValues = {
    [MODULE]: {
        app: {
            theme: {
                mode: 'light' as 'light' | 'dark'
            }
        },
        user: {
            userId: 123,
            userName: '张三',

            [MODULE]: {
                role: {
                    roles: ['Admin']
                }
            }
        }
    }
};
    
export type modularValuesType = typeof modularValues;

const mushroomService = of(MushroomService);
// 将patchVal, takeVal方法以及InjectVal装饰器导出，以便外部使用
export const { patchVal, takeVal, InjectVal } = mushroomService.buildValueDepsManager(modularValues); // 指定初始值
export const { patchVal, takeVal, InjectVal } = mushroomService.buildValueDepsManager<modularValuesType>(); // 仅指定值结构
```

2. 利用patchVal()方法提供或更新值：
```ts
patchVal('user.userId', 456); // 更新单个值
patchVal({ // 更新多个值
    'user.userId': 789,
    'user.userName': '李四'
});
```

3. 利用takeVal()方法获取值：
```ts
userId = takeVal('user.userId'); // 获取单个值
const [userId, userName] = takeVal('user.userId', 'user.userName'); // 获取多个值
```
patchVal()的参数以及takeVal()的返回值都是具有类型推断的，提升您在开发中的便利性！

4. 利用InjectVal()装饰器注入值：
```ts
@Injectable()
class RoleStore {
    @InjectVal('app.theme')
    static theme: { mode: 'light' | 'dark' };

    @InjectVal('app.theme', { mode: 'light' })
    static themeWithDefault: { mode: 'light' | 'dark' };

    @InjectVal('user.role.roles')
    roles: string[];
}
```

### 全局配置
目前支持配置默认被注入选项和注入选项，例如：
```ts
MushroomService.setGlobalConfig({
    defaultInjectableOptions: {
        setTo: 'sealed',
        type: 'cached'
    },
    defaultInjectOptions: {
        lazy: true
    }
});
```
注：此方法需要在程序中使用到任何默认值之前调用。

## 高级用法
### 使用DependencyConfig() 装饰器进行依赖配置
我们可以通过 **DependencyConfig()** 装饰器装饰自定义方法，来配置被依赖的类如何创建实例：
```ts
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
```ts
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee(configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = HoneyBee;
        configEntity.args = ['520'];
    }
}
```
当然，我们还可能需要使用 **Mushroom** 提供的 **registerDepsConfig** 方法（如果配置类在获取该依赖前不会被引用到），在程序的入口去注册该配置类：
```ts
registerDepsConfig(BeeConfig);
```
运行结果：
```ts
const bee = of(Bee);
console.log(bee instanceof HoneyBee); // true
console.log(bee.getName()); // "bee520"
console.log(bee.location); // "Jungle"
```
我们还可以在配置方法中直接返回要使用的实例：
```ts
export class BeeConfig {
    @DependencyConfig(Bee)
    private static configBee() {
        return by(Hornet, 999);
    }
}
```
```ts
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee.getName()); // bee999
console.log(bee.location); // Forest
```
该配置是一种深度查找的配置，如果当前配置指定了usingClass，则 **Mushroom** 还会继续查找本次usingClass的指定的配置进行进一步的配置，直到最后两次配置指定的usingClass一致为止。
```ts
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
```ts
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee instanceof FierceHornet); // true
```
如若不想继续深度查找配置，可以在配置方法中返回 **Mushroom** 提供的 **STOP_DEEP_CONFIG** 常量，来阻止继续深度查找配置：
```ts
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
```ts
const bee = of(Bee);
console.log(bee instanceof Hornet); // true
console.log(bee instanceof FierceHornet); // false
```
    
### 通过 Symbol 配置
当我们想完全依赖接口编程时或者无共同父类时，可以使用此配置方式：  
- 依赖注入时依然使用 **@Inject()** 装饰器
- 依赖查找时使用 **req()** 方法
```ts
export interface IBee {
    fly(): void;
}

@Injectable()
export class HoneyBee implements IBee {
    fly(): void {
        console.log('HoneyBee Flying!');
    }
}

@Injectable()
export class Hornet implements IBee {
    fly(): void {
        console.log('Hornet Flying!');
    }
}

@Injectable()
export class Sky {
    @Inject(Symbol.for('bee1'))
    bee1: IBee;
    @Inject(Symbol.for('bee2'))
    bee2: IBee;
}

export class BeeConfig {
    @DependencyConfig(Symbol.for('bee1'))
    private static configBee1(configEntity: DependencyConfigEntity<typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = HoneyBee;
    }

    @DependencyConfig(Symbol.for('bee2'))
    private static configBee2(configEntity: DependencyConfigEntity<typeof HoneyBee | typeof Hornet>) {
        configEntity.usingClass = Hornet;
    }
}
```

```ts
const bee1 = req<IBee>(Symbol.for('bee1'));
const bee2 = req<IBee>(Symbol.for('bee2'));
const sky = of(Sky);

sky.bee1.fly(); // 'HoneyBee Flying!'
sky.bee2.fly(); // 'Hornet Flying!'
bee1.fly(); // 'HoneyBee Flying!'
bee2.fly(); // 'Hornet Flying!'
```

### 使用函数代替 @DependencyConfig() 装饰器
如果运行环境不支持Typescript装饰器，可以使用 **setAsDependencyConfig()** 函数替代：

```ts
setAsDependencyConfig(Bee, (configEntity: DependencyConfigEntity<typeof Bee | typeof HoneyBee | typeof Hornet>) => {
    configEntity.usingClass = HoneyBee;
    configEntity.args = ['520'];
});
```

### 通过 by() 方法传递标识
我们可以利用 **by()** 方法，传递一个标识给依赖配置方法，去告知其如何配置依赖：
```ts
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
```ts
const bee1 = by(Bee, { flag: 1 }); // HoneyBee
const bee2 = by(Bee, { flag: 0 }); // Hornet
```

### afterInstanceCreate、afterInstanceFetch钩子
我们可以利用 **DependencyConfigEntity** 中的 **afterInstanceCreate** 、**afterInstanceFetch** 钩子进行在创建、获取到依赖后的一些自定义操作，这两个钩子的区别为：  
**afterInstanceCreate** 只在新实例化依赖后调用；  
**afterInstanceFetch** 在新实例化依赖以及得到依赖（如：获取已创建的单例依赖）后都会调用；  
顺序为**afterInstanceCreate** -> **afterInstanceFetch**  
下面会举一个利用 **afterInstanceCreate** 并借助 **MushroomService** 服务，配置局部范围内单例的例子：
```ts
@Injectable()
export class MonkeyChief {
    location: string;

    constructor(location: string) {
        this.location = location;
    }
}
```
```ts
export class ScopedClassesConfig {
    @Inject()
    private static mushroomService: MushroomService;

    @DependencyConfig(MonkeyChief)
    static configMonkeyChief(configEntity: DependencyConfigEntity<typeof MonkeyChief>): void | MonkeyChief {
        const location = configEntity.args[0];

        if (ScopedClassesConfig.mushroomService.containsDependencyWithKey(MonkeyChief, location)) {
            return ScopedClassesConfig.mushroomService.getDependencyByKey(MonkeyChief, location);
        } else {
            configEntity.afterInstanceCreate = (instance): void => {
                ScopedClassesConfig.mushroomService.addDependencyWithKey(MonkeyChief, instance, location);
            };
        }
    }
}
```
```ts
const huashanMonkeyChief1 = by(MonkeyChief, 'Huashan');
const huashanMonkeyChief2 = by(MonkeyChief, 'Huashan');

const taishanMonkeyChief = by(MonkeyChief, 'Taishan');

console.log(huashanMonkeyChief1 === huashanMonkeyChief2); // true
console.log(huashanMonkeyChief1 === taishanMonkeyChief); // false
```
如果你需要让这些实例可以被回收，可以用 **MushroomService** 中的 **addDependencyWithWeakKey()** 方法，代替 **mushroomService.addDependencyWithKey()** 方法，使你的Key（范围）成为弱引用。
    
<a id="cachedDependenciesAdvancedUsage"></a>
### 带有缓存的依赖，配置跟随特定对象的销毁来清除该依赖的缓存
在[创建带有缓存的实例](#createCachedDependencies)章节中，默认的跟随对象是this，也就是当自己不会再被用到的时候，实例将被销毁（缓存被清除）。我们还可以通过配置 **follow** 属性来跟随其他对象：
```ts
@Injectable<Bee>({
    type: 'cached',
    follow: function () {
        return this.following;
    }
})
export class Bee {
    constructor(public following: ObjectType) {}
}
```
注：在Vue3项目中，如果您使用了<script setup>的方式构建组件并依赖一个缓存类型的依赖作为服务，请勿在setup上下文中直接定义该服务，以及跟随销毁的对象，否则由于Vue会保存setup上下文中的属性，将不能及时清除该服务的缓存。

### 延迟注入
有时我们为了提升实例的初始化性能，可以为 **@Inject()** 装饰器传入 **{lazy: true}** 参数实现延迟注入：
```ts
@Injectable()
export class Bee {
    name = 'bee';

    @Inject({ lazy: true })
    honey: Honey;

    constructor() {}
}
```
```ts
const bee = of(Bee); // 这时bee.honey还未注入
const honey = bee.honey; // 获取bee.honey，会触发注入
console.log(honey);
```

### 循环依赖
**Mushroom** 提供了循环依赖检测机制，如果在依赖的创建过程中产生了循环依赖，会有错误提示：
```ts
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
```ts
const bee = of(Bee1); // Error: (39002) 检测到循环依赖：Bee1 -> Bee2 -> Bee3 -> Bee1
```
解决方式大致有2种：
1. 在使用该依赖的时候再通过 **of()** 或 **by()** 方法创建该依赖： （这里用setTimeout()来表示使用时）
```ts
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
```ts
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

## 更新日志
v1.4.6
- 修复index.d.ts中缺少setGlobalConfig的定义

v1.4.5
- 更新依赖版本

v1.4.4
- 修复在mushroom-pinia的onStoreCreated回调函数中无法拿到用成员变量方式注入的对象问题。

v1.4.3
- 进一步优化适配mushroom-pinia。

v1.4.2
- 新增全局配置功能。
- 修复已知问题。

v1.4.1
- 支持使用 setAsInjectable() 和 setAsDependencyConfig() 函数代替 @Injectable() 和 @DependencyConfig() 装饰器。

v1.4.0
- 增加通过Symbol配置依赖功能。
- @Injectable() 装饰器增加injectOnNew选项。







