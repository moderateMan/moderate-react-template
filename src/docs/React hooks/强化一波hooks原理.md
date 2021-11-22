首先`hooks`已经推出很久，想必大家或多或少都使用过或者了解过`hooks`，不知是否会和我一样都有一种感受，那就是`hooks`使用起来很简单，但总感觉像是一种魔法，并不是很清楚其内部如何实现的，很难得心应手，所以我觉得想要想真正驾驭Hooks，应该先从了解其内部原理开始。

# 函数组件的橘势
## hooks 之前
### 函数组件的基因限制
函数组件可以粗暴的认为就是类组件的render函数，即一个返回`jsx`从而创建虚拟`dom`的函数。

类组件有`this`，能够拥有自己的实例方法，变量，这样很容易就可以实现各种特性，比如`state`和生命周期函数，每一次渲染都可以认为是“曾经"的自己在不断脱变，有延续性。

反观函数组件就无法延续，每一次渲染都是“新”的自己，这就是函数组件的“基因限制”，有点像章鱼。

### 函数组件和类组件一个“小差异”
首先一个组件可以分别用类组件和函数组件写出两个版本，对吧

**类组件：**
```js
class CompClass extends Component {

 showMessage = () => {
 	alert("点击的这一刻，props中info为 " + this.props.info);
 };

 handleClick = () => {
	 setTimeout(this.showMessage, 3000);
	 console.log(`当前props中的info为${this.props.info},一致就说明准确的关联到了此时的render结果`)
 };

 render() {
 	return <div onClick={this.handleClick}>
		 <div>点击类组件</div>
	</div>;
 }
}
```

**函数组件：**
```js
function CompFunction(props) {
	
	const showMessage = () => {
		alert("点击的这一刻，props中info为 " + props.info);
	};
 
	const handleClick = () => {
		setTimeout(showMessage, 3000);
		console.log(`当前props中的info为${props.info},一致就说明准确的关联到了此时的		render结果`)
	};

return <div onClick={handleClick}>点击函数组件</div>;
}
```

那也就说这两者不同写法是等价的，对么？

答案是：通常情况下是等价的，但是有种情况二者不同

```js
export default function App() {
 const [info, setInfo] = useState(0);
 return (
	 <div>
		 <div onClick={()=>{
		 setInfo(info+1)
		 }}>父组件的info信息>> {info}</div>
		 <CompFunction info = {info}></CompFunction>
		 <CompClass info = {info}></CompClass>
	 </div>
 );
}
```

我已经把这个三块代码贴出来，建议动手检验一下。

**分析：**

一个组件渲染出来了，那么就会有一个结果，其中包括`props`，（当然也有`vdom`），而点击事件的处理函数同样也包括在内，那它无论是立即执行还是延迟执行，都应该与触发执行的那一刻render结果（你也可以理解为那一刻的快照）相关联。

**结论：**

所以事件回调函数所应该`alert`出的`info`应该为事件触发的那一刻，`render`结果中的`info`才对。

比如：你点击函数组件那一刻，传入的`props`中`info`是1，那么无论你在父组件怎么修改`info`，函数组件都会在3秒之后输出1，反之类组件就会输出父组件中`info`的最新值。

所以**函数组件的独特就是能够准确的获得关联`render`的数据**

`class`组件想做到这一点，多少有点难，毕竟this这个奶酪被React给动了，
反观函数借助闭包就能够实现准确的获取render的数据，而且现如今有了`hooks`，你让函数组件能够获得最新的`render`数据也有办法（后面会讲，毕竟这个可是大名顶顶的“**capture value**”），简直就是如虎添翼。


## hooks 之后
### hooks让这个“render”函数成精了

如果说在`hooks`之前，函数组件有一些“硬伤”，其独特之处又不能支撑它与类组件分庭抗礼，但是当`hooks`的到来之后，局面就不一样了，这个曾经的“`render`”函数一下就走起来了。

### hooks帮函数组件打碎了基因锁。
我们之前聊了，函数组件最大的硬伤就是"**次次重来，无法延续**" ，很难让它具备跟类组件那样的能力，比如用状态和生命周期函数，而如今`hooks`的加持，很好的粉碎了被类组件克制的枷锁。

所以说在了解如何使用`hooks`之前，最好要先了解函数组件是怎么拥有了延续性，这样使用`hooks`就”有谱“，否则你就会觉得`hooks`到处都是黑魔法，这么整就不是很”靠谱“了。


---

# 想要了解Hooks延续的奥秘，你可能得认识一下Fiber

没有延续性，遑论其他，真正让函数组件有延续性的幕后真大佬实际上是`Fiber`，为了能够很好的了解React怎么实现的这么多种`hooks`，那么`Fiber`你是绕不开的，不过学习`Fiber`不用太用力，**点到为止**，我们的目标就是能够更好的理解和使用`Hooks`。

## fiber 的结构
```js
type Fiber = {

 // 函数组件记录以链表形式存放的hooks信息，类组件存放`state`信息
 memoizedState: any,

 // 将diff得出的结果提交给的那个节点

 return: Fiber | null,

 // 单链表结构 child：子节点，sibling：兄弟节点

 child: Fiber | null,

 sibling: Fiber | null,
 
 ...


 // 每个workinprogress都维护了一个effect list（很复杂，不会也不耽误我们吃饺子）

 nextEffect: Fiber | null,

 firstEffect: Fiber | null,

 lastEffect: Fiber | null,

 ...

}
```
## fiber   的由来

React到底是如何将项目渲染出来的。

首先这个过程称为“reconciler”，可以先粗略讲reconciler划分出两个阶段。

1. **reconciliation** ：通过diff获得变动的结果。
2. **commit**：将变动作用到画面上（`side effect`即副作用，如`dom`操作）。

`reconciliation`是异步的，`commit`是同步的。

为什么拆分呢？

> reconciliation阶段包含的主要工作是对current tree 和 new tree 做diff计算，找出变化部分。进行遍历、对比等是可以中断，歇一会儿接着再来。 
> 
> commit阶段是对上一阶段获取到的变化部分应用到真实的DOM树中，是一系列的DOM操作。不仅要维护更复杂的DOM状态，而且中断后再继续，会对用户体验造成影响。在普遍的应用场景下，此阶段的耗时比diff计算等耗时相对短。  
> 
> 所以，Fiber选择在reconciliation阶段拆分
	

（引自[大转转FE](https://www.cnblogs.com/zhuanzhuanfe/p/9567081.html#:~:text=%E4%B8%BA%E4%BB%80%E4%B9%88%E5%AF%B9reconciliation,reconciliation%E9%98%B6%E6%AE%B5%E6%8B%86%E5%88%86)）

### 在fiber之前，React是如何实现的reconciliation

从头创建一个新的虚拟dom即vdom，与旧的vdom进行比对，从而得出结果，这个过程可是递归，而且是一气呵成，不能停的，这样JavaScript长时间的运行就会阻塞画面的渲染，就很卡。

>因为JavaScript在浏览器的主线程上运行，恰好与样式计算、布局以及许多情况下的绘制一起运行。如果JavaScript运行时间过长，就会阻塞这些其他工作，可能导致掉帧。

（引自[Optimize JavaScript Execution](https://developers.google.com/web/fundamentals/performance/rendering/optimize-javascript-execution#reduce_complexity_or_use_web_workers)）

那么可以说，旧的方式暴露了两点问题：

* **自顶向下遍历，不能停。**
* **React长时间的执行耽误了浏览器工作。**


###  vdom进化成为Fiber
`Fiber`可以理解为将上述整个`reconciliation`工作拆分了，然后通过链表串了起来，变成了一个个可以中断/挂起/恢复的任务单元。并且结合浏览器提供的`requestIdleCallback` API（有兴趣可以了解）进行协同合作。

> **Fiber核心是实现了一个基于优先级和requestIdleCallback的循环任务调度算法**。它包含以下特性：([参考：fiber-reconciler](https://reactjs.org/docs/codebase-overview.html#fiber-reconciler))

**直白的说：就一碗面条，一双筷子，以前React吃的时候，浏览器只能看着，现在就变成React吃一口换浏览器吃一口，一下就和谐了。**

而且`Fiber`就是按照`vdom`来拆分的，一个`vdom`节点对应一个`Fiber`节点，最后形成一个链表结构的fiber tree，大体如图：

 ![Image](https://s1.imagehub.cc/images/2021/11/21/fiber1.jpg)
 
child：指向子节点的指针
sibling：指向兄弟节点指针
return：提交变动结果（effectList）到指定的目标节点（图中没标示，下文会有动态演示）

**所以说`Fiber tree`就是可切片的`vdom tree`都不为过。**


### 那么`vdom`还存在么？
这个问题我思考了很久，请原谅这方面的源码我还没看透，我现在通过查阅多篇相关的文章，得出了一个我能接受，逻辑能自洽的解释。

**`Fiber`出来之后，`vdom`的作用只是作为蓝本进行构建`Fiber`树。**

em~，龙珠熟悉吧，`vdom`就好像是超级赛亚人1之前够用了，现在不行了，进化到了超级赛亚人2，即`Fiber`。


## Fiber是如何工作的
首先我已经知道，`Fiber tree`是一个链表结构，React是通过循环处理每个`Fiber`工作单元，在一段时间后再交还控制权给浏览器，从而协同的合作，让页面变得更加流畅。

要弄清函数组件怎么有的**延续性**的答案就藏在了这个**工作循环**中。

### 探索一下工作循环，workLoop

为了能够摆脱又困又长的源码分析，可以试着先简单的理解`workLoop`。

首先Loop啥呢？

**工作单元**，即`work`。

**`work`又可以粗略的分为：**

* **beginWork**：开始工作
* **completeWork**：完成工作

那么结合之前的Fiber tree，看一下

 ![Image](https://s1.imagehub.cc/images/2021/11/21/fiber.jpg)

那么看下大体的运转过程：

 ![Image](https://s1.imagehub.cc/images/2021/11/21/ezgif.com-video-to-gif-1.gif)
 
 那么通过动画我初步了解了整个`workLoop`的流转过程，简单描述下：
 
 1. 自顶`root`向下，流转子节点`b1`
 2. b1开始`beginWork`，工作目标根据情况diff处理，获得变动结果（effectList），然后判断是是否有子节点，没有那结束工作`completeWork`，然后流转到兄弟节点`b2`
 3. `b2`开始工作，然后判断有子节点`c1`，那就流转到`c1`
 4. `c1`工作完了，`completeWork`获得effectList，并提交给`b2`
 5. 然后`b2`完成工作，流转给`b3`,那么`b3`就按照这套路子，往下执行了，最后执行到了最底部`d2`
 6. 最后随着光标的路线，一路整合各节点的`effectList`，最后抵达`Root`节点，第1阶段-`reconciliation`结束，准备进入`Commit`阶段

### 再进一步，“延续”的答案就快浮出水面了

我们已经大致的了解了`workLoop`，但还不能解释为什么函数组件如何“延续”的，我们还要再深入了解，那么再细致一点分解`workLoop`，实际上是这样的：

![test.gif](https://i.loli.net/2021/11/21/sCh17rwUebTpEXy.gif)

**描述一下过程：**

1. 根据`current fiber tree`clone出`workinProgress fiber tree`，每clone一个`workinProgress fiber`都会尽可能的复用备用`fiber`节点（曾经的`current fiber`）
2. 当构建完整个`workinProgress fiber tree`的时候，`current fiber tree`就会退下去，作为备用`fiber`节点树，然后“`workinProgress fiber tree`就会扶正，成为新的`current fiber tree`
3. 然后就将收集完变动结果（`effect list`）的新`current fiber tree`，送去`commit`阶段，从而更新画面

**其中几个点我要注意：**

* 构建`workinProgress fiber tree`的过程，就是`diff`的过程，主要的工作都是发生在`workinProgress fiber`上，有变动就会维护一个`effect list`,当完成工作的时候就会提交格给`return`所指向的节点。
* 退位的`current fiber tree`,会化作下一次构建`workinProgress fiber tree`的原料，最大程度节约了性能，这样周而复始。
* 收集到的`effect list`只会关注有改动的节点，并且从最深处往前排列，这也就对应上了，刷新顺序是子节点到父节点。

### 双fiber树就是问题关键

**有两个阶段：**

* 首次渲染：直接先把`current fiber tree`构建出来
* 更新渲染： 延续`current fiber tree`构建`workinProgress fiber tree`

### 蜕变之中必有延续

更新阶段，两棵`fiber`树如双生一般，`current fiber`与`workinProgress fiber`之间用`alternate`进行了关联，也就是说，可以在处理`workinProgress fiber`工作的时候，能够获得`current fiber`的信息，除非是全新的，那就重新创建。

每构建一个`workinProgress fiber`，如果这个`fiber`对应的节点是一个函数组件，并且过`alternate`获得`current fiber`，那么就进行延续，承载其精华的便是`current fiber memoizedState`

### 延续的精华尽在`memoizedState`

**首次渲染时**

会按照顺序执行我们在函数组件的hooks，每执行一个种类hooks，都会创建一个对应该种类的hook对象，用来保存信息。

 * useState 对应 state信息
*  useEffect 对应 effect 对象
 * useMemo 对应 缓存的值和deps
 * useRef 对应 ref 对象
 * ...

这些信息都会以链表的形式保存在`current fiber`的`memoizedState`中


**更新渲染时**

每次构建对应的是**函数组件**的`workinProgress fiber`时，都会从对应的`current fiber`中延续这个**以链表结构存储的hooks信息**。

如该函数组件：

```js
export default function Test() {
 const [info1, setInfo1] = useState(0);
 useEffect(() => {}, [info1]);
 const ref = useRef();
 const [info2, setInfo2] = useState(0);
 const [info3, setInfo3] = useState(0);
 return (
	 <div>
		<div ref={ref}> {`${info1}${info2}${info3}`}</div>
	 </div>
 );
}
```

那么`hooks`的延续就如下图这样：

![hooksList.jpg](https://i.loli.net/2021/11/21/usa9mKhyp2EROC4.jpg)

通过链表的顺序去延续，如果其中的一个`hooks`写在条件语句中，

```js
export default function Test() {
 const [info1, setInfo1] = useState(0);
 let ref;
 useEffect(() => {
 setInfo1(info1+1)
 }, [info1]);
 if(info1==0){
 	ref = useRef();
 }
 const [info2, setInfo2] = useState(0);
 const [info3, setInfo3] = useState(0);
 return (
	 <div>
		<div ref={ref}> {`${info1}${info2}${info3}`}</div>
	 </div>
 );
}
```

那么就会破坏延续顺序，获得信息就会驴唇不对马嘴，就像这样：

![QQ截图20211121210010.jpg](https://i.loli.net/2021/11/21/7289BbCqdOnLRuI.jpg)

**所以这就是不能把`hooks`写在条件语句中的原因**

**而这就是Hooks能够延续的奥秘，作为支撑其实现各种功能，从而与class组件相媲美的前提基础。**

# 有了hooks对我们开发的一些改变
## 注意的闭包的坑capture value以及闭包陷阱
### capture value

`capture value`顾名思义，“捕获的的值”，函数组件执行一次就会产生一个闭包，就好像一个快照，
这跟我们上面分析说的“关联render结果”或者“那一刻快照”呼应上了。

当`capture value`遇上`hooks`出现了因使用“过期快照”而产生的问题，那就称为**闭包陷阱**。

不过叫什么不重要，归根节点都是“过期快照”的问题，而在useEffect中的暴露的问题最为明显。

先举个🌰：
```js
let B = (props) => {
  const { info } = props;
  const [count,setCount] = useState(0);
  useEffect(()=>{
    setInterval(()=>{
      //这才是dispatch函数正确的使用方式
      setCount((old)=>{
        return old+1;
      })
    },1000)
  },[])
  useEffect(()=>{
      setInterval(()=>{
          console.log("info为："+info+" count为："+count)
      },1000)
  },[])
  return <div></div>
}


let A = (props) => {
  const [info,setInfo] = useState(0);
  useEffect(()=>{
    setInterval(()=>{
      //这才是dispatch函数正确的使用方式
      setInfo((old)=>{
        return old+1;
      })
    },1000)
  },[])
  return <div>
    <B info={info}></B>
    {info}
    </div>
}

export default function App() {
  return (
    <div>
      <A>
      </A>
    </div>
  );
}
```
这种log出来的一直都是`info：0 count：0`，很显然使用的关联的“过期快照”中的数据。

解决办法：

通过`useRef`获得`ref`对象可是在**整个组件生命周期只维护一个引用的特性**，这样确保使用的数据都是最新的。

`ref`的结构是这样的：

```js
{
	current:null
}
```
我们把需要托管的数据赋值给`current`,值得一提的你只能赋值给`current`，**`ref`对象是不支持扩展的**。

然后我们重写一下代码：

```js
let B = (props) => {
  const { info } = props;
  const [count,setCount] = useState(0);
  const refInfoFromProps = useRef();
  const refCountFromProps = useRef();
  refInfoFromProps.current = info;
  refCountFromProps.current = count;
  useEffect(()=>{
    setInterval(()=>{
      //这才是dispatch函数正确的使用方式
      setCount((old)=>{
        return old+1;
      })
    },1000)
  },[])
  useEffect(()=>{
      setInterval(()=>{
          console.log("info为："+refInfoFromProps.current+" count为："+refCountFromProps.current)
      },1000)
  },[])
  return <div></div>
}
```

## useState和setState不太一样

`useState`的`set`函数跟类组件的setState命名很像，会让有种错觉他俩一样，其实不然，前者实际上是一个`dispath`，因为`useState`内部是基于`useReducer`实现的。

**其中有两点不同值得指出：**

`setState`:
 1. **第二个参数是一个函数**，可以在状态值设置生效后进行回调，我们就可以在这里面拿到最新的状态值。
 2. **setState具备浅合并功能**，比如state是`{a:1,b:2,c:{e:0}}`,`setState({c:{f:0},d:4})`,`state`就会合并成`{a:1,b:2,c:{f:0},d:4}`
 3. **`setState`设置状态就会引发刷新**，即使设置的是相同的值也一样，除非用`PureComponent`实现才能解决

 `set`函数
 1. **没有第二个参数**，但是可以借助`useEffect`组合实现,也还好
 2. **没有合并功能**，`set`啥是啥。。。,自己动手优化一下也是可以的。
 3. **设置相同的状态是不是触发刷新的**，这一点无需进行配置。

其中还有一个很奇怪的问题，那就是
### `useState`的`set`函数是同步的还是异步的？`setState`是同步还是异步的？

他俩的答案惊人的一致，即：

**大部分时候异步，有些时候同步**

具体什么时候同步呢？就是

[如果是由React引发的事件处理（比如通过onClick引发的事件处理），调用setState不会同步更新this.state，除此之外的setState调用会同步执行this.state](https://zhuanlan.zhihu.com/p/26069727#:~:text=%E5%A6%82%E6%9E%9C%E6%98%AF%E7%94%B1React%E5%BC%95%E5%8F%91%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%EF%BC%88%E6%AF%94%E5%A6%82%E9%80%9A%E8%BF%87onClick%E5%BC%95%E5%8F%91%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%EF%BC%89%EF%BC%8C%E8%B0%83%E7%94%A8setState%E4%B8%8D%E4%BC%9A%E5%90%8C%E6%AD%A5%E6%9B%B4%E6%96%B0this.state%EF%BC%8C%E9%99%A4%E6%AD%A4%E4%B9%8B%E5%A4%96%E7%9A%84setState%E8%B0%83%E7%94%A8%E4%BC%9A%E5%90%8C%E6%AD%A5%E6%89%A7%E8%A1%8Cthis.state)

不信，那看下代码：

```js
export default function Test() {
  const [info1, setInfo1] = useState(0);
  const [info2, setInfo2] = useState(0);
  const ref1 = useRef();
  const ref2 = useRef();
  ref1.current = info1;
  ref2.current = info2;
  useEffect(() => {
    setInfo1(ref1.current + 1);
    setInfo1(ref1.current + 1);
    setInfo1(ref1.current + 1);
    console.log("info1:"+ref2.current);
    setTimeout(() => {
      setInfo2(ref2.current + 1);
      setInfo2(ref2.current + 1);
      setInfo2(ref2.current + 1);
      console.log("info2:"+ref2.current);
    });
  }, []);
  return <div>{info1}</div>;
}
```
输出的日志是:
`info1:0`
`info2:3`

所有这一点上就跟setState一样了么，所以再说`useState`的`set`函数是异步还是同步的时候，知道怎么说了吧。

## useEffect可以多个，进行关注点分离

## 函数组件可以通过ref调用它的“成员函数”了
## useContext可以一定程度的替代第三方的数据管理库

先贴出完整可运行代码
```js
import {
  createContext,
  useContext,
  useReducer,
} from "react";
export const TestContext = createContext({})
const TAG_1 = 'TAG_1'

const reducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case TAG_1:
      return { ...state, ...payload };
      dedault: return state;
  }
};

export const A = (props) => {
  const [data, dispatch] = useReducer(reducer, { info: "本文作者" });
  return (
    <TestContext.Provider value={{ data, dispatch }}>
      <B></B>
    </TestContext.Provider>
  );
};

let B = () => {
  const { dispatch, data } = useContext(TestContext);
  let handleClick = ()=>{
    dispatch({
        type: TAG_1,
        payload: {
          info: "闲D阿强",
        },
      })
  }
  return (
    <div>
      <input
        type="button"
        value="测试context"
        onClick={handleClick}
      />
      {data.info}
    </div>
  );
};
```
**使用api有：**

* **createContext**
* **useReducer**
* **useContext**

**实现的步骤：**

* 函数组件A
	1. 使用`createContext`api创建一个`TestContext`,进而使用`Provider`
	2. 然后使用`useReducer`api创建一个`reducer`,将`reducer`返回的`data`, `dispatch`,通过`Provider`进行共享

* 函数组件B
	1. 在其内部使用`useContext`api并传入创建好的`TestContext`，从而获得`data`,`dispatch`
	2. 使用`data`中`info`值作为显示，通过点击事件调用`dispatch`进行修改，看是否

em~，目前来看可以在一定程度上替代数据管理库，对，是一定程度。
## 自定义hook不同于以往封装的工具函数
自定义hook，大概是这个样子的
```js
const useMousePosition = () => {
    const [position, setPosition] = useState({x: 0, y: 0 })
    useEffect(() => {
        const updateMouse = (e) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }
        document.addEventListener('mousemove', updateMouse)
        return () => {
            document.removeEventListener('mousemove', updateMouse)
        }
    })
    return position
}
```
我曾纠结过一个问题，写一个自定义`hook`和单纯封装一个函数有区别么？
现在看来，答案是肯定，至于如何去区分，我觉得是这样的：
自定义hook与其他工具函数的区别就在于可以使用官方提供的hook，拥有自己的状态，当然你也可以不用这个优势，那么就跟普通函数没啥区别了。。。
就这一手，拆分共用逻辑，避免的重复的发挥空间就更大了。

## 函数组件的性能优化的方式
# 总结
那么我们梳理一下思路

我们了解了
1. hooks推出前后，函数组件的局面变化，从而得出观点：函数组件能借助hooks变得这么强，是因为能够延续了，从而的出疑问，hooks怎么做到的延续。
2. 要想得出延续的答案，我们需要了解fiber，知道其工作原理，最后知道原来是fiber用memoizedState让hooks具有了延续能力
3. hooks的一些坑

# 题外话
每当我着迷Hooks的精妙，去查阅相关资料的时候，起初真的看的一头雾水，并没第一时间觉得文章有多好，随着我反复的阅读并动手调试React源码去印证一些疑惑，终于如我一般普通的coder也能勉强感受到文章的功力，但这引发了我的一个思考，是不是文章发力太深，就算力量再强，打不到读者也是弱，当好与大家越来越远，渐渐地没有了欣赏，那么也就没有了好，中庸的我希望能够粘合住二者，找一个合适位置发出我的力，如果这个力能打到尽可能多的的人，那么再弱的力也是强，这样就有可能帮助更多的人去欣赏真正好的文章，大家都想当“玉”，那么我就去当个“砖头”吧。
