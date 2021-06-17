import { action } from "mobx";
// import { debounce } from 'lodash';
import { changeStoreState } from "COMMON/utils/changeStoreState";
let CHECK_TYPE = {
    REQ: 0,
    RES: 1
}

/**
  *
  * @param fn {Function}   实际要执行的函数
  * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
  *
  * @return {Function}     返回一个“去弹跳”了的函数
  */
function debounce(fn, delay) {
    // 定时器，用来 setTimeout
    var timer
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function () {
        if (!timer) {
            fn.apply(this, arguments)
            timer = setTimeout(function () {
                clearTimeout(timer);
                timer = null;
            }, delay)
        }
    }
}

class BaseStore {
    constructor(props = {}, taret) {
        this.props = props;
        const {  api, apiParamsCheck, apiOption } = props;
        if (api) {
            this.api = api
            this.apiOption = {
                allDebounceDefault: true,
                allLoadingDefault: true,
                ...apiOption
            }
            this.apiFunc = {}
            this.toCreateApiFunc();
        }
        apiParamsCheck && (this.apiParamsCheck = apiParamsCheck);

    }
    toCreateApiFunc(option) {
        for (let key in this.api) {
            let option = this.apiOption[key] || {};
            const { allDebounceDefault, allLoadingDefault } = this.apiOption;
            const { isDebounce, isLoading } = option;
            const {getGlobal} = this.props
            this.apiFunc[key] = ({ api, apiName, params, resolve, reject }) => {
                this.toCheck({ type: CHECK_TYPE.REQ, params, apiName })
                
                if (isLoading || allLoadingDefault) {
                    getGlobal()?.changeParams({
                        isLoading: true,
                    });
                }
                api(params)
                    .then((res) => {
                        const { code, data } = res;
                        if (code === "200") {
                            this.toCheck({ type: CHECK_TYPE.RES, apiName, params: data })
                            resolve(res);
                        } else {
                            reject(res);
                        }
                    }).catch((res) => {
                        reject(res);
                    }).finally(() => {
                        if (isLoading || allLoadingDefault) {
                            getGlobal()?.changeParams({
                                isLoading: false,
                            });
                        }
                    });
            }
            if (isDebounce || allDebounceDefault) {
                this.apiFunc[key] = debounce(this.apiFunc[key], 1000)
            }
        }
    }
    /**
     * 加工了一下请求api的函数。
     * 
     * 副作用：
     *  1. 显示了一个全局loading。
     *  2. 判断了一下请求是否成功并进行通知提醒。
     *  3. 对接口的入参和出参进行检验是否符合要求（需配置）。
     *  4. 对接口进行防抖处理（需配置）
     * 
     * @param {*} apiName 请求api的函数名
     * @param {*} params 入参
     * @returns  promise 实例
     * @memberof BaseStore
     */
    fetchApiWrapper(apiName, params, options) {
        if (!this.api) throw ("api没有配置！")
        return new Promise((resolve, reject) => {
            this.apiFunc[apiName]({
                api: this.api[apiName],
                apiName,
                params,
                options,
                resolve,
                reject,
            })
        })
    }

    toCheck({ apiName, type, params }) {
        if (this.apiParamsCheck) {
            const checkReport = this.apiParamsCheck[
                type === CHECK_TYPE.REQ ?
                    "checkReqParams" :
                    "checkResParams"
            ]({ apiName, params });
            if (checkReport?.length) {
                let warnMessage = `${type === CHECK_TYPE.REQ ?
                    "请求参数校验：" :
                    "返回参数校验："}`;
                checkReport.forEach((item, key) => {
                    const { property, message } = item
                    warnMessage += `\napiName:${apiName}---property:${property}---info:${message}\n`;
                });
                console.warn(warnMessage)
            }
        }
    }
    @action
    changeParams = (params) => changeStoreState(this, params);
}

export default BaseStore;
