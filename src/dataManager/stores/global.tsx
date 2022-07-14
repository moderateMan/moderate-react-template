import { observable, action } from "mobx";
import { menuLocalConfig, menuRemoteConfig } from "@ROUTES/config";
import Storage from "@COMMON/storage";
import BaseStore from "./baseStore";
import encrypt from "@COMMON/aes/encrypt";
import { ACCESS_TOKEN, USER_NAME } from "@COMMON/constants";

type MenuConfigItemT = {
  "menuId": number, 
  "parentId": number
}
class Global extends BaseStore implements iGlobal {
  @observable menuConfig: any[] = [];
  @observable current: string = "";
  @observable scrollData: object = {};
  @observable isLogin: boolean = false;
  @observable locale: string = "zh";
  @observable isHash: boolean = true;
  @observable isRandomTheme: boolean = false;
  @action
  loginFn = (
    userName: string | number,
    password: string | number,
    code: string | number,
    language: string,
    loginCb: any
  ) => {
    const data = {
      userName,
      password,
      code,
      language,
    };
    let encryptData = { body: encrypt(JSON.stringify(data)) };
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("loginApi", encryptData)
        .then((res: any) => {
          const {
            data: { token },
          } = res;
          this.isLogin = true;
          Storage.setMoreStorage([ACCESS_TOKEN, token, USER_NAME, userName]);
          resolve(res);
        })
        .catch((res) => {
          reject();
        });
    });
  };
  @action
  getMenu = (params: any) => {
    return new Promise((resolve, reject) => {
      if(this.menuConfig.length===0){
        this.menuConfig = [...menuRemoteConfig, ...menuLocalConfig];
      }
      resolve(this.menuConfig);
    });
  };

  //请求翻页
  @action
  register = (params:[]|object) => {
      return new Promise((resolve, reject) => {
          this.fetchApiWrapper("register", params)
              .then((res:any) => {
                  resolve(res);
              }).catch((res) => {
                  reject(res)
              })
      });
  };

  //请求翻页
  @action
  checkSession = (params:[]|object) => {
      return new Promise((resolve, reject) => {
          this.fetchApiWrapper("checkSession", params)
              .then((res:any) => {
                  resolve(res);
              }).catch((res) => {
                  reject(res)
              })
      });
  };



  /**
   * 退出登录的方法
   * @param cb 退出登录之后的回调
   */
  @action
  logoutFn = (logoutCb: () => any) => {
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("logoutApi", {})
        .then((res: any) => {
          const { code } = res;
          if (code === "200") {
            Storage.clear();
            this.isLogin = false;
            logoutCb && logoutCb();
          }
          resolve(res);
        })
        .catch((res) => {
          reject();
        });
    });
  };
}

export type iGlobal = {
  current: string;
  scrollData: object;
  isLogin: boolean;
  locale: string;
  changeParams: (data: any) => void;
  docTreeMap?: any[];
  isHash?:boolean;
  formatMessage?(params: any): string;
};

export default Global;
