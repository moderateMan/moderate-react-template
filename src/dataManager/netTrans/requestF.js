import Storage from "COMMON/storage";
import stores from "STORE";
import { ACCESS_TOKEN } from "COMMON/constants";
import moment from "moment";
import { warningByMessage, warningByNotice } from "COMMON/utils/notification";
const { NODE_ENV, MOCK } = process.env;
/*此commonUrl不许改动*/
let commonUrl = "/shopServiceUserGUI";
console.log("2312312312")

export default class FetchRequest {
    static unAuthorizateUrls = ["/login", "/getCode"];
    static timeoutFlag = "current request timeout";

    static initialState() {
        Storage.clear();
        window.location.href = "/login";
    }

    /**
     * Post请求的方法
     * @param url       请求URL地址
     * @param params    请求参数
     */
    static post(url, requestData = "", options = {}) {
        const { global } = stores;
        // global.changeParams({ isLoading: true });
        /**定义token变量*/
        let token = ""; //用户登入的token
        /**
         * 判断如果是登入请求是，设置token为空
         * 其他请求，从sessionStorage中获取token
         */
        if (!this.unAuthorizateUrls.includes(url)) {
            /**获取token变量*/
            token = Storage.getStorage(ACCESS_TOKEN);

            if (!token) {
                /**未登入返回到登入页面*/
                this.initialState();
                return;
            }
        }

        /**设置请求地址*/
        if (!url.includes("http")) url = commonUrl + url;

        const fetchParams = {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Authorization: token,
            },
            mode: "cors",
        };
        if (requestData) {
            fetchParams["body"] = JSON.stringify(requestData);
        }
        const fetchFn = [fetch(url, fetchParams)];

        const requestOptions = {
            timeout: 2,
            messageWarning: false,
            ...options,
        };
        const { timeout, messageWarning } = requestOptions;

        let timer;
        if (timeout) {
            const timeoutFn = new Promise((resolve, reject) => {
                timer = setTimeout(
                    () => reject(this.timeoutFlag),
                    timeout * 1000
                );
            });
            fetchFn.push(timeoutFn);
        }
        return (
            Promise.race(fetchFn)
                .then((response) => response.json())
                .then((responseData) => {
                    /**
                     * 网络请求成功返回的数据
                     * 200:数据正确；
                     * 202:数据错误；
                     * 203：用户未登入，跳转到登入页面
                     */
                    const { code, message } = responseData;
                    if (code === "203") {
                        this.initialState();
                        return;
                    } else if (code === "202" || code == "500") {
                        messageWarning
                            ? warningByMessage(message)
                            : warningByNotice(message);
                    }
                    return Promise.resolve(responseData);
                })
                /**异常处理*/
                .catch((err) => {
                    const {
                        global: { formatMessage },
                    } = stores;
                    if (err === this.timeoutFlag) {
                        const timeoutMessage = formatMessage({
                            id: "common.timeoutException",
                        });
                        messageWarning
                            ? warningByMessage(timeoutMessage)
                            : warningByNotice(timeoutMessage);
                    } else {
                        const serverExceptionMessage = formatMessage({
                            id: "common.serverException",
                        });
                        messageWarning
                            ? warningByMessage(serverExceptionMessage)
                            : warningByNotice(serverExceptionMessage);
                        console.log("err:", url, err);
                    }
                    return Promise.reject();
                })
                .finally(() => {
                    timer && clearTimeout(timer);
                })
        );
    }

    static requestPostBlob(url, requestData = "", options = {}) {
        let token = "";
        if (!this.unAuthorizateUrls.includes(url)) {
            token = Storage.getStorage(ACCESS_TOKEN);
            if (!token) {
                this.initialState();
                return;
            }
        }

        /**设置请求地址*/
        url = commonUrl + url;

        const fetchParams = {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Authorization: token,
            },
            mode: "cors",
        };
        if (requestData) {
            fetchParams["body"] = JSON.stringify(requestData);
        }
        const { messageWarning } = options;

        return new Promise((resolve, reject) => {
            fetch(url, fetchParams)
                .then((res) => res.blob())
                .then((res) => {
                    if (res.type.includes("json")) {
                        return res.text();
                    } else {
                        const downloadUrl = URL.createObjectURL(res);
                        const a = document.createElement("a");
                        a.href = downloadUrl;
                        const date = moment().format("YYYY-MM-DD");
                        a.download = "summary_data_result_" + date;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        //	changeParams({ loadDisabled: false })
                    }
                })
                .then((res) => {
                    if (res !== undefined) {
                        const { code, message } = JSON.parse(res);
                        if (code === "203") {
                            this.initialState();
                            return;
                        } else if (code === "202") {
                            messageWarning
                                ? warningByMessage(message)
                                : warningByNotice(message);
                        }
                        resolve();
                    }
                })
                .catch((err) => {
                    const {
                        global: { formatMessage },
                    } = stores;
                    const serverExceptionMessage = formatMessage({
                        id: "common.serverException",
                    });
                    messageWarning
                        ? warningByMessage(serverExceptionMessage)
                        : warningByNotice(serverExceptionMessage);
                    console.log("err:", url, err);
                    reject();
                });
        });
    }

    static requestPostFileBlob(url, requestData = "", options = {}) {
        let token = "";
        if (!this.unAuthorizateUrls.includes(url)) {
            token = Storage.getStorage(ACCESS_TOKEN);
            if (!token) {
                this.initialState();
                return;
            }
        }

        /**设置请求地址*/
        url = commonUrl + url;

        const fetchParams = {
            method: "POST",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
                Authorization: token,
            },
            mode: "cors",
        };
        if (requestData) {
            fetchParams["body"] = JSON.stringify(requestData);
        }
        const { messageWarning } = options;
        return new Promise((resolve, reject) => {
            fetch(url, fetchParams)
                .then((res) => res.blob())
                .then((res) => {
                    if (res.type.includes("json")) {
                        return res.text();
                    } else {
                        const {
                            userDownloadStore: { selectedFile, changeParams },
                        } = stores;

                        const downloadUrl = URL.createObjectURL(res);
                        const a = document.createElement("a");
                        a.href = downloadUrl;
                        a.download = selectedFile[0];
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        changeParams({ selectedFile: [] });
                    }
                })
                .then((res) => {
                    if (res !== undefined) {
                        const { code, message } = JSON.parse(res);
                        if (code === "203") {
                            this.initialState();
                            return;
                        } else if (code === "202") {
                            messageWarning
                                ? warningByMessage(message)
                                : warningByNotice(message);
                        }
                        resolve();
                    }
                })
                .catch((err) => {
                    const {
                        global: { formatMessage },
                    } = stores;
                    const serverExceptionMessage = formatMessage({
                        id: "common.serverException",
                    });
                    messageWarning
                        ? warningByMessage(serverExceptionMessage)
                        : warningByNotice(serverExceptionMessage);
                    console.log("err:", url, err);
                    reject();
                });
        });
    }
}
