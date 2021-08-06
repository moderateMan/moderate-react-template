import Mock from 'mockjs'
// import mockFetch from 'mockjs-fetch';
// mockFetch(Mock);

export default class BaseApi {
    constructor(props) {
        const { config, apiConfig } = props;
        this.config = config;
        this.toMock({
            apiConfig
        })
    }

    toMock({ apiConfig = {} }) {
        if (typeof apiConfig !== 'object') {
            return console.error("apiConfig类型错误！")
        }
        for (let key in this.config) {
            let mockApi = apiConfig[key];
            if (mockApi) {
                let mock = this.config[key];
                var reg = new RegExp("\\" + mockApi)
                Mock.mock(reg, mock)
            }
        }
    }
}