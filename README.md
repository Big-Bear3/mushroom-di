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
这样我们就通过最简单的依赖查找的方式，得到了对该类实例（依赖）。我们还可以通过 **of()** 方法一次性获得多个依赖：
```
const [bee1, bee2, bee3, ...] = of(Bee1, Bee2, Bee3, ...);
```
### 单例与多例
或许我们在项目中需要一些单例的依赖，我们可以为 **@Injectable()** 传入一个 **type** 参数，很容易的控制一个类创建出的实例是单例的还是多例的：
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













