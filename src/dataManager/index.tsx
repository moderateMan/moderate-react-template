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
