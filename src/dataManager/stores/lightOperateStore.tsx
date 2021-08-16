import { observable, action } from "mobx";
import BaseStore, { BaseStorePropsT } from "./baseStore";
type LocationListT = {
  [key: string]: any;
};
class LightOperateStore extends BaseStore {
  @observable pageSum = 1; //总页数
  @observable pageCount = 0; //总条数
  @observable lightItemArr = []; //pos列表数据
  @observable lightName = "";
  @observable comment = "";
  @observable editingKey = ""; //当前编辑的PosItem Key
  @observable isNewAddFlag = false; //当前编辑的PosItem Key
  @observable locationList: LocationListT = {}; //

  constructor(props: BaseStorePropsT) {
    super(props);
  }
  //初始化
  initStore = () => {
    this.pageSum = 1;
    this.pageCount = 0;
    this.lightItemArr = [];
    this.lightName = "";
    this.comment = "";
    this.editingKey = "";
    this.isNewAddFlag = false;
    this.locationList = [];
  };

  @action
  fetchLightAdd = (params: any) => {
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("fetchLightAdd", params)
        .then((res) => {
          resolve(res);
        })
        .catch((res) => {
          reject();
        });
    });
  };

  @action
  fetchLightUpdate = (params: any) => {
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("fetchLightUpdate", params)
        .then((res) => {
          resolve(res);
        })
        .catch((res) => {
          reject();
        });
    });
  };

  @action
  fetchInitEx = (params: any) => {
    return Promise.all([
      this.fetchLightDetail(params),
      this.fetchTestDataList(),
    ]);
  };

  @action
  fetchLightDetail = (params: any) => {
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("fetchLightDetail", params)
        .then((res: any) => {
          let item = res.data[0];
          this.lightName = item.lightName;
          this.comment = item.comment;
          this.lightItemArr = item.lightItems.map((item: any, key: any) => {
            if (!key) {
              item.key = item.lightItemId;
            }
            return item;
          });
          resolve(res);
        })
        .catch((res) => {
          reject(res);
        });
    });
  };

  @action
  fetchTestDataList = () => {
    return new Promise((resolve, reject) => {
      this.fetchApiWrapper("fetchTestDataList", {})
        .then((res: any) => {
          this.locationList = res.data;
          this.locationList["WORLD"] = ["xxx"];
          resolve(res);
        })
        .catch((res) => {
          reject("失败");
        });
    });
  };
}

export default LightOperateStore;
