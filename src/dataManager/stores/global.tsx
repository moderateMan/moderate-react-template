import { observable, action } from "mobx";
class Global  implements iGlobal{
    @observable current:string="";
    @observable scrollData:object={};
    @observable isLogin:boolean=false;
    @observable locale:string="zh";
    constructor(props:any) {
    }
    @action
    changeParams = () => {

    }
}

export type iGlobal =  {
    current:string,
    scrollData:object,
    isLogin:boolean,
    locale:string,
    changeParams:(data:any)=>void
}

export default Global;