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

再在程序的入口使用 **of()** 方法，获取该类的实例（依赖）。
```
const bee = of(Bee);
```
这样我们就通过最简单的依赖查找的方式，得到了对该类实例。我们还可以通过 **of()** 方法一次性获得多个依赖。
```
const [bee1, bee2, bee3, ...] = of(Bee1, Bee2, Bee3, ...);
```
