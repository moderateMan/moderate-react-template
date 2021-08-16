问题点：函数参数约束了，传入多余的居然不会报红,小问题，值得研究
```ts
interface StateData {
    a:string[],
    b:string[],
    c: boolean,
    d: any[],
    e: any[]
}

let a = {
    a: [],
    b: [],
    c: false,
    d: [],
    e: [],
    AA:1,
    BB:2
};

let funcA = (props:StateData)=>{

}
funcA(a)
```
