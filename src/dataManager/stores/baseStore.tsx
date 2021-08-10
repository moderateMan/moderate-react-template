import { action } from "mobx";
// import { debounce } from 'lodash';
import { changeStoreState } from "@COMMON/utils/changeStoreState";
let CHECK_TYPE = {
  REQ: 0,
  RES: 1,
};

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */

function debounce<T extends (...args: any) => any>(fn: T,delay: number) {
  // 定时器，用来 setTimeout
  let timer: any;
  return function () {
    // 存在timer说明不久前执行了操作
    if (!timer) {
      // 立刻执行，不等的那种
      fn.apply(this, Array.from(arguments));
      // 下面的单纯就是一个切换flag的逻辑
      timer = setTimeout(function () {
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  };
}


type BaseStorePropsT = {
  api: any;
  apiParamsCheck: any;
  apiOption: any;
  [key: string]: any;
};

type apiOptionT = {
  allDebounceDefault?: boolean;
  allLoadingDefault?: boolean;
  [key: string]: any;
};
type apiFuncItemParamsT = {
  api?: any;
  apiName?: any;
  params?: any;
  options?: any;
  resolve?: (...args: any) => void;
  reject?: (...args: any) => void;
};
type apiFuncItemT = (params: apiFuncItemParamsT) => any[] | void;
type apiFuncT = {
  [key: string]: apiFuncItemT;
};
type apiParamsCheck = {
  [key: string]: apiFuncItemT;
};

class BaseStore {
  props: BaseStorePropsT;
  api: any;
  apiOption: apiOptionT = {};
  apiFunc: apiFuncT = {};
  apiParamsCheck: apiParamsCheck = {};
  constructor(props: BaseStorePropsT) {
    this.props = props;
    const { api, apiParamsCheck, apiOption } = props;
    if (api) {
      this.api = api;
      this.apiOption = {
        allDebounceDefault: true,
        allLoadingDefault: true,
        ...apiOption,
      };
      this.apiFunc = {};
      this.toCreateApiFunc();
    }
    apiParamsCheck && (this.apiParamsCheck = apiParamsCheck);
  }
  toCreateApiFunc(option?: any) {
    for (let key in this.api) {
      let option = this.apiOption[key] || {};
      const { allDebounceDefault, allLoadingDefault } = this.apiOption;
      const { isDebounce, isLoading } = option;
      const { getGlobal } = this.props;
      this.apiFunc[key] = ({
        api,
        apiName,
        params,
        resolve = () => {},
        reject = () => {},
      }) => {
        this.toCheck({ type: CHECK_TYPE.REQ, params, apiName });

        if (isLoading || allLoadingDefault) {
          getGlobal()?.changeParams({
            isLoading: true,
          });
        }
        api(params)
          .then((res: { code: string; data: any }) => {
            const { code, data } = res;
            if (code === "200") {
              this.toCheck({ type: CHECK_TYPE.RES, apiName, params: data });
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((res: any) => {
            reject(res);
          })
          .finally(() => {
            if (isLoading || allLoadingDefault) {
              getGlobal()?.changeParams({
                isLoading: false,
              });
            }
          });
      };
      if (isDebounce || allDebounceDefault) {
        this.apiFunc[key] = debounce(this.apiFunc[key], 1000);
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
  fetchApiWrapper(apiName: string, params: any, options?: any) {
    if (!this.api) throw "api没有配置！";
    return new Promise((resolve, reject) => {
      this.apiFunc[apiName]({
        api: this.api[apiName],
        apiName,
        params,
        options,
        resolve,
        reject,
      });
    });
  }

  toCheck({
    apiName,
    type,
    params,
  }: {
    apiName: string;
    type: number;
    params: any;
  }) {
    if (this.apiParamsCheck) {
      let key = type === CHECK_TYPE.REQ ? "checkReqParams" : "checkResParams";
      const checkReport = this.apiParamsCheck[key]({ apiName, params });
      if (checkReport?.length) {
        let warnMessage = `${
          type === CHECK_TYPE.REQ ? "请求参数校验：" : "返回参数校验："
        }`;
        checkReport.forEach((item, key) => {
          const { property, message } = item;
          warnMessage += `\napiName:${apiName}---property:${property}---info:${message}\n`;
        });
        console.warn(warnMessage);
      }
    }
  }
  @action
  changeParams = (params: any) => changeStoreState(this, params);
}

export default BaseStore;
