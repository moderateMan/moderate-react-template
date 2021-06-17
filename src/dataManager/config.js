import {
    Global,
    LightHomeStore,
    LightOperateStore,
    HeavyHomeStore,
    HeavyOperateStore,
} from 'STORE';
import {
    lightOperateApi,
    lightHomeApi,
    globalApi,
    heavyHomeApi,
    heavyOperateApi,
} from "API";
import {
    lightOperateApiCheck
} from "NET_TRANS/apiParamsChecks";
{
    /* 配置mock启动 */
    const { NODE_ENV, MOCK } = process.env;
    if (NODE_ENV === "development") {
        if (MOCK != "none") {
            require('MOCK');
        }
    }
}

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
                api: lightOperateApi,
                apiParamsCheck: lightOperateApiCheck,
                apiOption: {
                    fetchTestDataList: {
                        isDebounce: true,
                        isLoading: true
                    }
                }
            }
        },
        heavyHomeStore: {
            storeClass: HeavyHomeStore,
            params: {
                ...common,
                api: heavyHomeApi,
                apiOption: {
                    fetchTestDataList: {
                        isDebounce: true,
                        isLoading: true
                    }
                }
            }
        },
        heavyOperateStore: {
            storeClass: HeavyOperateStore,
            params: {
                ...common,
                api: heavyOperateApi,
                apiOption: {
                    fetchTestDataList: {
                        isDebounce: true,
                        isLoading: true
                    }
                }
            }
        }
    }
}




