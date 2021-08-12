import request from "@DATA_MANAGER/netTrans/myReuqest";
type BaseApiPropsT = {
  config: { [key: string]: string };
};
type RequestPostParams = {
  name: string;
  payload: any;
};
export default class BaseApi {
  config: any;
  [key: string]: any;
  constructor(props: BaseApiPropsT) {
    const { config } = props;
    this.config = config;
    this.process();
  }
  requestPost({ name, payload }: RequestPostParams) {
    let url = this.config[name];
    if (!url) {
      throw "未配置相关接口的请求地址";
    }
    return request.post(url, payload);
  }
  getUrlConfig() {
    return this.config;
  }
  process() {
    for (let key in this.config) {
      this[key] = (data: any) => {
        return this.requestPost({ name: key, payload: data });
      };
    }
  }
}
