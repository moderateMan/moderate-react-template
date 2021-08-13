import { Global, LightHomeStore, LightOperateStore } from "./stores/index";
import { lightOperateApi, lightHomeApi, globalApi } from "@API/index";

export default function config() {
  let common = {
    getGlobal: this.getGlobal,
  };
  return {
    global: {
      storeClass: Global,
      params: {
        ...common,
        api: globalApi,
      },
    },
    lightHomeStore: {
      storeClass: LightHomeStore,
      params: {
        ...common,
        api: lightHomeApi,
      },
    },
    lightOperateStore: {
      storeClass: LightOperateStore,
      params: {
        ...common,
        api: lightOperateApi,
      },
    },
  };
}
