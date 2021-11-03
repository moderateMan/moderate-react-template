
起初我是通过Umi了解的Redux，当时Dva就是基于Redux的，用起来说不上不好，就是有点烦，烦ta的墨迹，费劲。后来当我用上了Mobx，哇偶，ta的简单，随性让我着迷，不再拘谨，就这样我选择了Mobx，但当用着用着，总在不经意间去怀念Redux，渐渐地理解了ta，我才明白约束不是过分的要求，而我现在只想从混乱中逃走，如今我遇到了Natur，才会越发地觉得合适。

# 状态管理库的管中窥
开发中大型项目，往往会使用状态管理库，当下比较主流的就是Redux和Mobx，二者我觉得最大的区别是理念，即状态数据是不是不可变值，众所周知，React和Redux一致遵循了不可变值，Natur也是如此。

# 开门见山
先说一下我的观点，我是结合两方面进行判断的，一个是短期看上手，另一个是长远看维护，结果如下：

**上手难度**：Redux>**Natur**>Mobx

**维护难度**：Mobx>**Natur**>Redux

对于我这种经常开发不大不小，中拨溜项目的开发者来讲，**Natur更适合**。

那么接下就从这**两方面**简单地**分析一下Natur**。

# Natur的上手分析
先贴下完整代码：
```js
	import { createStore, createInject } from "natur"; 
	import { ... } from 'natur/dist/middlewares'; // 引入内置中间件
	/*-------------装备-start-------------*/
	//创建状态模块-Module（状态切片）
	const testModule = {
	 	// 状态数据
		 state: {
			testValue: 0,
		 },
		 // 计算属性
		 maps: {...},
		 // 修改状态的动作
		 actions: {...},
	};
	//创建仓库-Store
	export const naturStore = createStore(
		// 状态模块，也可以理解为“状态切片”
		{ testModule },
		//懒加载模块
		{},
		//配置
		{
		 //中间件，直接按照官网推荐的来
		 middlewares: [...],
		}
	);
	/*-------------装备-over-------------*/
	/*-------------提供注入-start-------------*/
	//对外提供注入其数据的能力
	export const injectNaturStore = createInject({ storeGetter: () => naturStore });
	/*-------------提供注入-over-------------*/
```
*在使用状态管理库之前，我们得先知道怎么创建出来，才能谈页面组件怎么装备使用。*
## 创建状态仓库-Store
代码如下
```js
/*-------------装备-start-------------*/
	//创建状态模块-Module（状态切片）
	const testModule = {
	 	// 状态数据
		 state: {
			testValue: 0,
		 },
		 // 计算属性
		 maps: {...},
		 // 修改状态的动作
		 actions: {...},
	};
	//创建仓库-Store
	export const naturStore = createStore(
		// 状态模块，也可以理解为“状态切片”
		{ testModule },
		//懒加载模块
		{},
		//配置
		{
		 //中间件，直接按照官网推荐的来
		 middlewares: [...],
		}
	);
	/*-------------装备-over-------------*/
```

通过代码我们看出，创建仓库的api是`createStore`,参数有三个：
1. **状态模块**，也可以理解为“状态切片”，**本文重点介绍**
2. **懒加载状态模块**
3. **配置**，Natur提供了诸多配置项，而针对上手来讲，主要便是**“中间件”**

### 配置-中间件
这部分直接用官方推荐的方案就完了，本文不做深挖赘述，代码如下。
```js
{
    middlewares: [
      thunkMiddleware, // action支持返回函数，并获取最新数据
      promiseMiddleware, // action支持异步操作
      fillObjectRestDataMiddleware, // 增量更新/覆盖更新
      shallowEqualMiddleware, // 新旧state浅层对比优化
      filterUndefinedMiddleware, // 过滤无返回值的action
      devTool, // 开发工具
    ],
  }
```
**本文所有的对Natur的介绍，都是基于该官方中间件配置进行的。**

### 懒加载状态模块
异步的实现就是在同步模块基础上使用了import的动态引入，伪代码如下：
```js
const module1 = () => import('同步状态模块');
```

### 状态模块-Module
Module就是一个由state，maps，actions组成的对象，代码如下：
```js
	//创建状态模块-Module（状态切片）
	const testModule = {
	 	// 状态数据
		 state: {
			testValue: 0,
		 },
		 // 计算属性
		 maps: {...},
		 // 修改状态的动作
		 actions: {...},
	};
```

#### state
就是一个普通的对象。
```js
    state: {
            number: 1,
            value: 2
    },
```
####  maps
计算属性。
```js
    maps: {
            // 数组前面的元素，都是在声明此map对state的依赖项，最后一个函数可以获取前面声明的依赖，你可以在里面实现你想要的东西
            sum1: ['number', 'value', (number, value) => number + value],
            // 你也可以通过函数的方式声明依赖项，这对于复杂类型的state很有用
            sum2: [state => state.number, s => s.value, (number, value) => number + value],
            // 也可以是个函数，直接依赖整个state，缺点是只要state更新就会重新执行函数，没有缓存
            sum3: ({number, value}) => number + value,
            // 也可以是个函数，没有依赖，只执行一次
            isTrue: () => true,
    }
```
#### actions
修改状态的途径，无论同步或者异步均在在此选项下进行配置，action是一个函数，代码如下。

```js
同步：
    actions: {
            ...
            // 这里是异步更新state中的name数据
            testAsyncAction: (value: number) => {
                    return { value: value };
            }
            ...
    }
```

```js
异步-返回promise：
    actions: {
            ...
            // 这里是异步更新state中的name数据
            testAsyncAction: (value: number) => {
                    return Promise.resolve({ value })
            }
            ...
    }
```

```js
异步-返回函数：
    actions: {
            ...
            // 这里是异步更新state中的name数据
            testAsyncAction: (myParams) =>{
                     return ({
                            setState
                     }) => {
                             setTimeout(() => {
                                    setState(Date.now())
                             }, 5000);
                     }
            }
            ...
    }
```


## 页面组件上的使用
### 创建注入器
```js
    ...
    export const injectNaturStore = createInject({ storeGetter: () => naturStore });
    ...
```
使用创建好的仓库来制作一个注入器Hoc，这样就可以向组件的Props中注入状态模块。

### 使用注入器
```js
    ...
    //引入并使用注入器
    import { injectNaturStore } from "@DATA_MANAGER/index";
    let injecter = injectNaturStore(["testModule"]);
    type PropsT = {
            [prop: string]: any;
    } & typeof injecter.type;
    //页面组件
    class TestViewUI extends React.Component<PropsT>{
            ...
    }
    injecter(TestViewUI)
```

### 使用状态Module数据
```js
    this.props.lightHomeStoreN?.state?.testValue
```

### 修改状态Module数据
```js
同步和异步一致
    this.props.lightHomeStoreN.actions.testAsyncAction("测试异步响应！");
    this.props.lightHomeStoreN.actions.testSyncAction("测试同步响应！");
```

### 设置页面响应状态Module更新的粒度
#### 监听Module的所有
注入的模块一变化，就更新页面组件，即触发render。
```js
    injectNaturStore(["testModule"])
    或
    injectNaturStore("testModule")
```

#### 监听Module的部分
注入的模块一变化，就更新页面组件，即触发render。
```js
    let complexInjector = inject(
      ['testModule',{state: [s => s.xxx], maps: ['xxx']}],
      ['other', {state: [s => s.xxx], maps: ['xxx']}]
    );
    或
    complexInjector = inject('app', 'other')
      .watch('app', {})
      .watch('other', {state: [s => s.xxx], maps: ['xxx']})

```
优化总是在需要的时候做，而Natur提供了一定的优化途径。


## 对比
### Natur直接就有了模块，很暖心
直接就分成了模块，这也是我喜欢Mobx的原因之一，反观Redux
```js
    const testReducer = (state = { testValue:0 }, action = {}) => {
       const { type, payload } = action;
       switch (type) {
             case "action_1":
                     return Object.assign({}, state, {
                     testValue: state.testValue+1
                     });
             case "action_2":
                     return Object.assign({}, state, {
                     testValue: state.testValue-1
                     });
             case "action_3":
                     return Object.assign({}, state, {
                     testValue: payload
                     });
             default: return state;
       }
    };
```
相比Redux这一大块的Reducer，能直接就分模块是真的好，Redux也可以自行地进行拆分从而达到分模块，就像Dva那样拆分，然后用nameSpace进行标注，但”本身就有“和”动手自助“，这不一样啊，怎么形容呢。。。

> 就好比说合租，你觉得用隔断做成的插间和一个原本就独立的房间能一样吗？

我觉得”本身就有“的体验好。

### 页面使用上来看，Natur就很原始，但某种意义上讲反而更好
#### 与react结合方式
对于Redux和Mobx在页面上的使用类似，都是借助其他”结合助手“，如reudx-react和mobx-react

*问题：*
1. Mobx和Redux都需要“结合助手”，但为什么Natur不用呢？
2. 话说这个”结合助手“被单独设立的意义是什么？


我认为Mobx和Redux应该是考虑到不单对React一方进行结合，所以将“结合”这块抽出来，分别针对不同方来进行制作”结合助手“。

这么想的话，那么Natur不用，估计是因为只针对React一方进行结合。这对React使用者来说应该说反而简单了。。。

#### 在页面上使用Natur仓库的方式
直接通过链式调用的方式，这就跟Mobx有点神似了，em~ ~ ~，很原始，很直接，好处很实际，如果是用Ts开发，就会有联想提示，，比如：
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fd3193b26fe43009d81d6ed64890364~tplv-k3u1fbpfcp-zoom-1.image">
</p>

这其实很棒，反观Redux：
```js
    dispatch({
            type: 'settings/changeSetting',
            payload: config,
    })
```
你可以说Redux的dispatch很高级，简洁，但不可否认，多少有点“迷”。

dispatch传入的type，需要准确拼写无误，还没有提示，我想知道目的地在哪，我还得查找，甚至全局搜索。。。。难受

相比一看，原始的方式更简单，思路还清晰，关键还有提示，省的我费劲记住”邮寄地址“了。

#### 跟Mobx比上手难度，省省吧
这还用比么，Mobx有那么多事？随性的不要不要的，Mobx建议应该永远只对**修改**状态的函数使用动作，而你不加都行在非严格模式下，状态想改就改，无拘无束，也许你不明白它到底怎么可观察的，调试时看可观察对象还容易醉，但这都不算事，开心最大嘛。

### 我的观点
基于以上主观的分析，我得出了我的观点。

**上手难度**：Redux>**natur**>Mobx

# Natur的维护分析
维护分析有别于上手分析，后者主要从基础细节出发，循序渐进的的展开，直到完整实现功能，策略就是从下到上，维护分析我觉得就得反着来了，用从上到下的策略，从具体的实际问题触发，顺理成章地推导，直到清晰得出实现方案。

##  项目成长的烦恼

### 一个页面一个状态Module够了
从我这个如此普通的开发者视角来讲，我的项目肯定是要用状态管理库的，我是按照页面来划分状态Module的，也就是一个页面对应一个Module，开始还好，完成一些业务功能后，体量不大。
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/313e032a92a343a3ad81f49d102c9e87~tplv-k3u1fbpfcp-zoom-1.image">
</p>

随着项目不断地开发，每个页面的状态Module越来越复杂，
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2af7863fe06c4d749d9c8312bb1d6e94~tplv-k3u1fbpfcp-zoom-1.image">
</p>

各有甚者，状态Model间还有一些往来，那关系叫一个错综复杂啊。

### 一个不够了该怎么办
本来一个页面，子组件还都小，通过父组件获得状态module数据单向地往下传，这日子还算能过，但是当子组件越来越复杂，又有了自己的子组件，那么单向就变得费劲了（怎么有种熟悉之感）,那么子组件就想脱离单向，直接地去访问这个页面状态module，行不行？

### 子组件想越矩，不行，没到时候
子组件跳过父组件直接拿数据，这不合规矩，不是绝对不行，而是没到时候，如果子组件都去拿页面状态数据，做了本该父组件做的事情，那么就是促进分裂，组成页面的父组件和子组件应该更好地结合团结，而不是貌合神离，所以这种行为不可取，那么问题还得解决，那就得从这状态module入手了。

### 化整为零，有点乱啊
你想要把“整个”页面状态module，拆分给页面中各个够格的子组件，如
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1251226eb40f463b81e75ae06fe3814d~tplv-k3u1fbpfcp-zoom-1.image">
</p>

想的是挺好，首先这些拆分后的状态module对应的子组件可是很相关的，那就肯定免不了彼此的通信，关系那可就老铁了，如
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62b5adabdb9042d4ba7a50d1a0cf0bc1~tplv-k3u1fbpfcp-zoom-1.image">
</p>

### 总得有module先站出来
那么关系这么复杂，那就统一的让瘦身成功的页面组件module管吧，毕竟地位还在，为了维护状态模块间的秩序，主要做的就是**跨模块的通信以及业务处理**这方面
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e168abe834b94144bb956e9c7d0b4f45~tplv-k3u1fbpfcp-zoom-1.image">
</p>

但是渐渐的页面组件module又胖了，这把不单是胖，还有点不守“本分”了，这可不行啊。

###  天降猛男，natur-service很知性
有些coder实现了项目基本功能后，会对品质产生追求，不希望再忍受混乱，希望一切看起来井井有条，但是往往挡住脚本的总是挡住脚本，这颗进步的心就这样倔强的存在，进退两难，而natur-service知道怎么做可以组织好代码，从混乱中解脱，有了ta，局面就变成这样了，如：
<p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/292125412c4e4447b2d3cd384aff6165~tplv-k3u1fbpfcp-zoom-1.image">
</p>
 
 甚至还可以这样
 <p align="center">
 <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85296983ffcc43d2a7db2de6f029d04f~tplv-k3u1fbpfcp-zoom-1.image">
</p>

完全可以进一步根据自己对业务的理解再分堆。

## natur-service的开发使用
### 安装 natur-service
```shell
    yarn add natur-service
```


### 创建一个natur-service实例
先写一个store当测试例子
`testStore.ts`
```js
import { createStore } from 'natur';

const count = {
  state: 1,
  actions: {
    inc: (state) => state + 1,
    dec: (state) => state - 1,
  }
}

const modules = {
  count,
  count1: count,
};

const lazyModules = {};

export const store = createStore(modules, lazyModules);
export type M = typeof modules;
export type LM = typeof lazyModules;
```

然后在同目录下新建个`service.ts`

```js
import {store, M, LM} from "./testStore.ts";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    ...
  }
}

// 实例化，开始监听
const countService = new CountService();
```

### 模块间的通信
```js
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // 执行count模块的inc方法
    this.dispatch('count', 'inc', 0).then(() => {
      // 如果count是一个还未加载的模块，那么等到count加载完成后才会触发这个action
      // 如果在未加载完成期间，重复多次的调用同一个action，那么旧的dispatch会抛出一个固定的Promise错误，以清除缓存，防止爆栈
      console.log('dispatch完成');
    })
  }
}

// 实例化，执行推送
const countService = new CountService();
```

### 监听模块的更新、以及更新的详情信息

```js
import {store, M, LM} from "store";
import NaturService from "natur-service";

class CountService extends NaturService<M, LM> {
  constructor() {
    super(store);
    // 观察count模块， ModuleEvent请看文档
    this.watch("count", (me: ModuleEvent) => {
      // 这是更新详情
      console.log(me);
      // 这是你要执行的业务逻辑
      console.log('count module has changed.');
    });
  }
}

// 实例化，开始监听
const countService = new CountService();
```

**ModuleEvent**

| 属性名称        | 说明          | 类型          |
| --------   | :------------  | :----------: |
| state        | 模块最新的state      |   any | undefined   |
| type        | 触发模块更新的类型，'init' 是模块初始化触发，'update' 是模块的state更新时触发，'remove'是模块卸载时触发     |   'init' | 'update' | 'remove'    |
| actionName | 触发模块更新的action名称，只有在 type为'update'时才会存在     |   string | undefined    |
| oldModule | 旧模块的数据，当type为'init'时为undefined     |   InjectStoreModule | undefined    |
| newModule | 新模块的数据，当type为'remove'是为undefined    |  InjectStoreModule | undefined    |

## 对比
### 所有的状态都放在仓库里行不行

无论是使用Dva（Redux）还是Mobx，都被这个问题困扰过很久，经过纠结我选择了一个折中方案：
> 我先写成组件状态，然后根据需要再讲这个组件状态改成仓库状态。

不全放在仓库里有几点顾虑：
1. 都放进去，我就分不清哪些状态是全局，哪些是局部了（可能没啥太大必要）。
2. 都放进去，那么多的状态全混在一起，那这个module就会很臃肿。
3. 拆分模块的话，跨模块通信，互相监听彼此的业务，会不会变得很混乱啊。

### 有了natur-service，问题就简单了
#### Redux跨模块通信就有点拉了

Redux也许专注的是全局状态管理，连拆分模块都得自己动手，Dva就很好地完善了Redux，但仍会有一个尴尬的问题，人嘛容易懒，你会发现写来写去，一个`model`的`effect`一堆，但是`reducer`就一个，毕竟这么多`effect`都用一个`reducer`看起来也没啥不行的。

但这么做，跨模块通信触发的`reducer`不就都用这一个了么，那还咋分清是哪个action触发的啊。

#### 跨模块通信容易了，模块拆分也就好管了
有了natur-service，在拆分module这块就好了不少，让跨模块通信变得井井有条，同时也没有让模块间有耦合关系，
相比Dva你得用`put`来触发指定模块的`effect`或者`reducer`。
```js
    *testEffect(_, { call, put, select }) {
            ...
            yield put({
                    type: '其他模块/effect或者reducer',
                    payload: data,
            });
            ...
    }
```
Mobx就更过，直接得引入这个模块，从而执行相应的`action`。
```js
	@action
	fetchLightDelete = (params:any) => {
            ...
            otherModule.testAction()
            ...
	}
```
natur根本就不用在模块里写这个写这些，你完全可以通过设立一个flag状态变量和触发它改变的action就行。
```js
    class CountService extends NaturService<M, LM> {
        constructor() {
            this.watch("flagAction", (me: ModuleEvent) => {
                    this.dispatch('count', 'inc', 0).then(() => {});
            }
        }
    }
```
虽然加了一个无关紧要的flagState来触发natur-service的监听的方式有些“做作”，但这可以让natur-servic精细掌控跨模块通信。

#### 一些多个仓库整合调度的业务就不用混在UI层了。 

有种业务场景，非常适合natur-service发挥，比如A页面有了个仓库操作，首页和用户页面会有连带的一些仓库状态的操作，一般我是要在UI层搞的，也就是在组件的生命周期的`componentDidmount`这种函数里进行业务整合。

但是选哪个页面里写呢？看似应该谁引起的谁写，但一细想，这不耦合了，为啥其他页面的业务要在登录页面写呢？这么一想确实不是很好，而有了natur-service，直接交给它就完了，省的纠结在哪写，写来写去还容易乱。

### 和Mobx较量一下维护性。。。
我觉得不用比了，Mobx的可变值这一点，如果不加一套严格的规范和一些必要手段（做个统一修改入口函数啥的），你就很难管理好Mobx，太自由，爱过火。


### 我的观点
基于以上主观的分析，我得出了我的观点。

**维护难度**：Mobx>**Natur**>Redux

比较下来，真的我心里越发的觉得**Natur**更好维护，不过Redux毕竟大牌子，估计应该更好吧。。。



# 总结
通过短期看上手和长远看维护，我比较下来，Natur很适合我，能够很好的满足我组织代码的需求，对于一个常常开发中拨溜项目的我来说，正正好好。


# 题外话
作为一个普普通通前端coder，每当看到一个国内开发者的库，尤其是没有光环的，我会格外的关注和尊重，并拿出足够的热情去学习和分享，我认为好的库就好像一个发光体，能用来取暖获取力量，同时更应该将光折射出去，而不是去遮掩，这是可耻的，也是徒劳的，然而一个优秀的光源是不惧怕掩盖的，也是盖不灭的，因为只有自己能让自己发光。
