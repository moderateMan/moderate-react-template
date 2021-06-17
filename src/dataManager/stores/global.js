import { observable, action } from "mobx";
import { globalApi as api } from "API/";
import Storage from "COMMON/storage";
import {
    menuLocalConfig,
    menuRemoteConfig
} from "ROUTES/config";
import BaseStore from './baseStore'
import {
    ACCESS_TOKEN,
    USER_NAME,
} from "COMMON/constants";

import encrypt from "COMMON/aes/encrypt";

class Global extends BaseStore {
    @observable isLogin = false;
     /* loading刷新标识 */
     @observable isRandomTheme=false;
    /* loading刷新标识 */
    @observable isLoading;
    /* 当前语言 */
    @observable locale;
    /* 国际化函数的托管 */
    @observable formatMessage;
    /* 驱动左侧菜单栏目显示的数据，由后台驱动和本地自定义组成 */
    @observable menuConfig = [];
    /* 文档相关 */
    @observable docList = [];
    @observable docTreeMap = {};
    @observable scrollData = {};
    @observable current = "";

    
    

    constructor(props) {
        super(props);
        this.initialAllObservableState();
    }

    @action
    initialAllObservableState = () => {
        this.isLoading = false;
        this.locale =
            Storage.getStorage("language") ||
            window.navigator.language.split("-")[0] ||
            "zh";
        this.menuConfig = [];
        this.docList = [];
        this.docTreeMap = {};
    };

    @action
    changeLocale = (locale) => {
        this.changeParams({ locale });
        Storage.setStorage("language", locale);
        if (locale === "en") {
            document.title = "Moderate";
        } else {
            document.title = "中用";
        }
    };

    @action
    getMenu = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("getMenuApi", params)
                .then((res) => {
                    const { data} = res;
                    if (Array.isArray(data)) {
                        this.menuConfig = [...data, ...menuLocalConfig];
                    } else {
                        if(data){
                            console.log("有数据，但不是数组！")
                        }
                        this.menuConfig = menuRemoteConfig;
                    }
                    resolve();
                }).catch((res) => {
                    reject()
                })
        });
    };

    @action
    refreshGetMenu = () => {
        this.getMenu();
    };

    @action
    loginFn = (userName, password, code, language, loginCb) => {
        const data = {
            userName,
            password,
            code,
            language,
        };
        let encryptData = { body: encrypt(JSON.stringify(data)) };
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("loginApi", encryptData)
                .then((res) => {
                    const { data: { token } } = res;
                    this.isLogin = true;
                    Storage.setMoreStorage([
                        ACCESS_TOKEN,
                        token,
                        USER_NAME,
                        userName,
                    ]);
                    resolve();
                }).catch((res) => {
                    reject()
                })
        });

    };

    /**
   * 退出登录的方法
   * @param cb 退出登录之后的回调
   */
    @action
    logoutFn = (logoutCb) => {
        this.menuConfig = []
        api.logoutApi().then((res) => {
            const { code } = res;
            if (code === "200") {
                Storage.clear();
                this.isLogin = false;
                logoutCb && logoutCb();
            }
        });
    };
}

export default Global;