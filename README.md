# mushroom-di
## 安装
1. 安装依赖包
```
npm i mushroom-di
```
2. 在tsconfig.json中添加如下属性：
```
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
"useDefineForClassFields": false,
```
## 如何使用？
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
这样我们就通过 **mushroom** 的依赖查找功能，得到了对该类实例（依赖）。我们还可以通过 **of()** 方法一次性获得多个依赖：
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

### 构造方法注入
首先我们再创建一个类Honey，用于将其实例注入到Bee类:
```
@Injectable({ type: 'multiple' })
export class Honey {
    honeyType = 'Jujube honey';
}
```
在Bee类中使用构造方法注入
```
@Injectable()
export class Bee {
    name = 'bee';

    constructor(private honey: Honey) {}
}
```
这样，在我们使用 **of()** 获取Bee的实例时，**mushroom** 会自动将Honey的实例注入到bee中：
```
const bee = of(Bee);
```







