import request from '@DATA_MANAGER/netTrans/myReuqest'

export default class BaseApi {
    constructor(props) {
        const { config } = props
        this.config = config;
        this.process();
    }
    requestPost({ name, payload }) {
        let url = this.config[name]
        if (!url) {
            throw "未配置相关接口的请求地址";
        }
        return request.post(url, payload)
    }
    getUrlConfig() {
        return this.config;
    }
    process() {
        for (let key in this.config) {
            this[key] = (data) => {
                return this.requestPost({ name: key, payload: data })
            }
        }
    }
}