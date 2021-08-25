## 封装状态管理库得时候  传入只需要是一个对象  签名这些可以直接生成  setXxx 这种

```ts
function debounce<T extends (...args: any) => any>(fn: T):(...args:Parameters<T>)=>ReturnType<T> {
  // 定时器，用来 setTimeout
//   console.log("123123")
//   let timer: any;
//   return function () {
//     // 存在timer说明不久前执行了操作
//     if (!timer) {
//       // 立刻执行，不等的那种
//       fn.apply(this, Array.from(arguments));
//       // 下面的单纯就是一个切换flag的逻辑
//       timer = setTimeout(function () {
//         clearTimeout(timer);
//         timer = null;
//       }, delay);
//     }
//   };

return function(this:any,...args) {
        return fn.apply(this,args)
    }
}
function test(a:number,b:number){

}
const aaa = debounce(test)

interface Store {
    aaa:number;
    bbb:string;
    ccc:boolean;
    ddd:{
        a:number;
        b:string
    }
}

const store:{
[P in `set${Capitalize<keyof Store>}`]:(params:Store[P extends `set${infer A}`?Uncapitalize<A>:never])=>void
} = {} as any
```