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
### of()方法、@Injectable()装饰器
首先我们需要一个用于创建实例的类，并将其用@Injectable()装饰器装饰：
