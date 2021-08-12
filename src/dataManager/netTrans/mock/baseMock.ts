import Mock from "mockjs";
// import mockFetch from 'mockjs-fetch';
// mockFetch(Mock);
type ConfigItemT = {
  code: string | number;
  data: any;
};
export type ConfigT = {
  [key: string]: ConfigItemT | ((data: any) => ConfigItemT|void);
};
type BaseApiPropsT = {
  config: ConfigT;
  apiConfig: {
    [key: string]: any;
  };
};
export default class BaseApi {
  config: any;
  constructor(props: BaseApiPropsT) {
    const { config, apiConfig } = props;
    this.config = config;
    this.toMock({
      apiConfig,
    });
  }

  toMock({ apiConfig = {} }: { [key: string]: any }) {
    if (typeof apiConfig !== "object") {
      return console.error("apiConfig类型错误！");
    }
    for (let key in this.config) {
      let mockApi = apiConfig[key];
      if (mockApi) {
        let mock = this.config[key];
        var reg = new RegExp("\\" + mockApi);
        Mock.mock(reg, mock);
      }
    }
  }
}
