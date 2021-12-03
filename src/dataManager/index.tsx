import {createContext} from "react"

import createConfig from "./config";
import BaseStore from "./stores/baseStore";
import { createStore, createInject, StoreModule } from "./natur/src/index";
import {LightHomeStore} from "./stores"
import {
  thunkMiddleware,
  promiseMiddleware,
  fillObjectRestDataMiddleware,
  shallowEqualMiddleware,
  filterUndefinedMiddleware,
} from "./natur/src/middlewares";

type iStores = {
  storeConfig: any;
  currentStores: any[];
  [key: string]: any;
};

type changeParamsT = {
  storeName: string;
  payload: {
    type?: string;
    data?: any;
  };
};

export class Stores implements iStores {
  storeConfig: any;
  currentStores!: any[];
  [key: string]: any;
  constructor() {
    this.storeConfig = createConfig.call(this);
    this.totoInstantiaze();
  }

  getMgr(stores: Array<string>) {
    this.currentStores = stores;
    return this;
  }

  //修改状态
  change(params: changeParamsT) {
    const { storeName, payload } = params;
    const { type, data } = payload;
    if (!(storeName in this)) {
      console.error("无效的storeName");
      return;
    }
    let store: BaseStore = this[storeName];
    store.change(data);
  }

  //异步触发动作
  action(params?: changeParamsT) {
    const { storeName, payload } = params!;
    if (!(storeName in this)) {
      console.error("无效的storeName");
      return;
    }
    const {type="",data} = payload;
    return new Promise((res)=>{
      this.naturStores.getModule(storeName).actions[type]?.(data).then(()=>{
        res({})
      })
    })
  }

  totoInstantiaze() {
    let modules:{[key:string]:StoreModule} = {};
    for (let key in this.storeConfig) {
      const { storeClass, params } = this.storeConfig[key];
      this[key] = new storeClass();
      modules[key] = {
        state:this[key].state,
        maps:this[key].maps,
        actions:this[key].actions
      };
    }
    
    type modulesT = {
      lightHomeStore:LightHomeStore
    }
    
    this.naturStores = createStore<modulesT,{}>(
      modules as modulesT,
      {},
      {
        initStates:{
          lightHomeStore:{
            testValue:"",
            number:123,
          }
        },
        middlewares: [
          thunkMiddleware, // action支持返回函数，并获取最新数据
          promiseMiddleware, // action支持异步操作
          fillObjectRestDataMiddleware, // 增量更新/覆盖更新
          shallowEqualMiddleware, // 新旧state浅层对比优化
          filterUndefinedMiddleware, // 过滤无返回值的action
        ],
      }
    );

    this.MobXProviderContext = createContext(modules)
    this.injectNaturStore = createInject({ storeGetter: () => this.naturStores });
  }
}

export default new Stores();
