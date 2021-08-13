import createConfig from "./config";
import { iGlobal } from "@DATA_MANAGER/stores/global";
import Global from "@DATA_MANAGER/stores/global";

type iStores = {
  global: iGlobal;
  storeConfig: any;
  [key: string]: any;
};

let globalIns = new Global();
class Stores implements iStores {
  storeConfig: any;
  global: iGlobal = globalIns;
  [key: string]: any;
  constructor() {
    this.storeConfig = createConfig.call(this);
    this.totoInstantiaze();
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

import { lightHomeStoreN, globalN } from "./storesNatur/index";

import { createStore, createInject,StoreModule } from "natur";
import { 
  thunkMiddleware,
  promiseMiddleware, 
  fillObjectRestDataMiddleware,
  shallowEqualMiddleware, 
  filterUndefinedMiddleware,
} from 'natur/dist/middlewares';

export type StoreModuleN = StoreModule;
export const naturStores = createStore({ globalN,lightHomeStoreN}, {},{
  middlewares: [
    thunkMiddleware, // action支持返回函数，并获取最新数据
    promiseMiddleware, // action支持异步操作
    fillObjectRestDataMiddleware, // 增量更新/覆盖更新
    shallowEqualMiddleware, // 新旧state浅层对比优化
    filterUndefinedMiddleware, // 过滤无返回值的action
  ],
});
export const injectNaturStore = createInject({ storeGetter: () => naturStores });
