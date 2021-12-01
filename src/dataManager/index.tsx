import createConfig from "./config";
import { iGlobal } from "@DATA_MANAGER/stores/global";
import Global from "@DATA_MANAGER/stores/global";
import BaseStore from './stores/baseStore';

type iStores = {
  global: iGlobal;
  storeConfig: any;
  currentStores: any[];
  [key: string]: any;
};

type changeParamsT = {
  storeName: string;
  payload: {
    type: string;
    data: any;
  };
};

let globalIns = new Global();
export class Stores implements iStores {
  storeConfig: any;
  global: iGlobal = globalIns;
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
    const {type,data} = payload;
    if(!(storeName in this)){
      console.error("无效的storeName")
      return
    }
    let store:BaseStore = this[storeName];
    store.change(data);
  }

  //异步触发动作
  action(params: changeParamsT) {
    const { storeName, payload } = params;
    if(!(storeName in this)){
      console.error("无效的storeName")
      return
    }
    let store:BaseStore = this[storeName];
    store.action(payload);
  }

  getGlobal = () => {
    return this.global;
  };

  totoInstantiaze() {
    for (let key in this.storeConfig) {
      const { storeClass, params } = this.storeConfig[key];
      this[key] = new storeClass(params);
    }
  }
}

export default new Stores();
