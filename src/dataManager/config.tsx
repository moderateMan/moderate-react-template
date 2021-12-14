import {
    Global,
    LightHomeStore,
    LightOperateStore
} from './stores/index';
import {
    lightOperateApi,
    lightHomeApi,
    globalApi,
} from "@API/index";

// {
//     /* 配置mock启动 */
//     const { NODE_ENV, MOCK, ELECTRON } = process.env;
//     const isEnvElectron = process.env.ELECTRON === "electron";
//     console.log("ELECTRON"+isEnvElectron)
//     require('MOCK');
// }

export default function config() {
    let common = {
        getGlobal: this.getGlobal
    }
    return {
        global: {
            storeClass: Global,
            params: {
                ...common,
                api: globalApi
            }
        },
        lightHomeStore: {
            storeClass: LightHomeStore,
            params: {
                ...common,
                api: lightHomeApi
            }
        },
        lightOperateStore: {
            storeClass: LightOperateStore,
            params: {
                ...common,
                api: lightOperateApi
            }
        }
    }
}




