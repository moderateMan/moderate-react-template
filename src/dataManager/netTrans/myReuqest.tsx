/**
 * 网络请求配置
 */
import axios from "axios";
import Storage from "@COMMON/storage";
import dataManager from "@DATA_MANAGER/index";
import {openNotificationWithIcon} from "@COMMON/utils";
import { ACCESS_TOKEN } from "@COMMON/constants";
const { NODE_ENV, MOCK } = process.env;

let publicPath = "";
if (NODE_ENV === "development") {
  /*联调服务器地址，前提是该地址的服务支持跨域请求*/
  // publicPath = "http://*.*.*.*:*/api";
}
const ERR_CODE_LIST = {
  //常见错误码列表
  [400]: "请求错误",
  [401]: "登录失效或在其他地方已登录",
  [403]: "拒绝访问",
  [404]: "请求地址出错",
  [408]: "请求超时",
  [500]: "服务器内部错误",
  [501]: "服务未实现",
  [502]: "网关错误",
  [503]: "服务不可用",
  [504]: "网关超时",
  [505]: "HTTP版本不受支持",
};
class Request {
  _axiosInstance: any;
  constructor(props?: any) {
    /* 创建axios实例，在这里可以设置请求的默认配置 */
    this._axiosInstance = axios.create({
      /* 超时10s */
      timeout: 10000,
      /* 发布环境的baseURL或开发环境的反向代理所匹配的值 */
      baseURL: publicPath,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      /* 是给服务器用的,标识是ajax(异步)请求 */
    });
    this.interceptReqest();
    this.interceptResponse();
  }
  /** 添加请求拦截器 **/
  interceptReqest() {
    this._axiosInstance.interceptors.request.use(
      (config:any) => {
        config.headers["token"] = Storage.getStorage(ACCESS_TOKEN) || "";
        if (config.url.includes("pur/contract/upload")) {
          config.headers["Content-Type"] = "multipart/form-data";
        }
        return config;
      },
      (error:any) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );
  }
  /** 添加响应拦截器  **/
  interceptResponse() {
    this._axiosInstance.interceptors.response.use(
      (response:any) => {
        if (response?.data) {
          const { code = "200" } = response.data;
          /* 你是直接用code，还是用statusText是否为ok来判断，取决于与后台的约定 */
          /* (提一下：mockJs就用的statusText为大写的OK来标示的) */
          if (
            code === "200" ||
            response.statusText.toLocaleLowerCase() === "ok"
          ) {
            return Promise.resolve(response);
          } else {
            return Promise.reject(response);
          }
        } else {
          openNotificationWithIcon("error", "no data");
          return Promise.reject("no data");
        }
      },
      (error:any) => {
        if (error.response) {
          const { status="" } = error.response;
          /* token或者登陆失效情况下跳转到登录页面 ,因情况而定*/
          if (error.response.status === 401) {
            //   window.history.push(LOGIN)
          }
          const {
            global: { formatMessage=(params:any)=>{return ""}},
          } = dataManager;
          const headerErrorOpen = formatMessage({ id: "header.errorOpen" });
          openNotificationWithIcon(
            "error",
            ERR_CODE_LIST[status as keyof typeof ERR_CODE_LIST] || headerErrorOpen
          );
          return Promise.reject(error);
        } else {
          return Promise.reject("请求超时, 请刷新重试");
        }
      }
    );
  }
  /**
   * 封装get方法
   * @param url  请求url
   * @param params  请求参数
   * @returns {Promise}
   */
  get(url:string, params = {}) {
    return new Promise((resolve, reject) => {
      this._axiosInstance
        .get(url, {
          params: params,
        })
        .then((response:any) => {
          resolve(response.data);
        })
        .catch((error:any) => {
          reject(error);
        });
    });
  }

  /**
   * 封装post请求
   * @param url
   * @param params
   * @returns {Promise}
   */
  post(url:string, params = {}, config:{[key:string]:any} = {}) {
    return new Promise((resolve, reject) => {
      if (typeof params === "object") {
        if (params.constructor.name === "FormData") {
          config["Content-Type"] = "multipart/form-data";
        }
      }
      this._axiosInstance.post(url, params, config).then(
        (response:any) => {
          resolve(response.data);
        },
        (err:any) => {
          reject(err);
        }
      );
    });
  }

  /**
   * 封装patch请求
   * @param url
   * @param params
   * @returns {Promise}
   */
  patch(url:string, params = {}) {
    return new Promise((resolve, reject) => {
      this._axiosInstance.patch(url, params).then(
        (response:any) => {
          resolve(response.data);
        },
        (err:any) => {
          reject(err);
        }
      );
    });
  }

  /**
   * 封装put请求
   * @param url
   * @param params
   * @returns {Promise}
   */
  put(url:string, params = {}) {
    return new Promise((resolve, reject) => {
      this._axiosInstance.put(url, params).then(
        (response:any) => {
          resolve(response.data);
        },
        (err:any) => {
          reject(err);
        }
      );
    });
  }
}

export default new Request();
