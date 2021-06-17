import { observable, action } from "mobx";
import BaseStore from './baseStore'

class LightOperateStore extends BaseStore {
    @observable pageSum = 1; //总页数
    @observable pageCount = 0; //总条数
    @observable lightItemArr = []; //pos列表数据
    @observable lightName = "";
    @observable comment = "";
    @observable editingKey = ""; //当前编辑的PosItem Key
    @observable isNewAddFlag = false; //当前编辑的PosItem Key
    @observable locationList = []; //

    constructor(props) {
        super(props)
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
    }

    @action
    fetchLightAdd = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchLightAdd", params)
                .then((res) => {
                    resolve();
                }).catch((res) => {
                    reject()
                })
        });
    };

    @action
    fetchLightUpdate = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchLightUpdate", params)
                .then((res) => {
                    resolve();
                }).catch((res) => {
                    reject();
                })
        });
    };

    @action
    fetchInitEx = (params) => {
        return Promise.all([
            this.fetchLightDetail(params),
            this.fetchTestDataList(),
        ]);
    };

    @action
    fetchLightDetail = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchLightDetail", params)
                .then((res) => {
                    let item = res.data[0];
                    this.lightName = item.lightName;
                    this.comment = item.comment;
                    this.lightItemArr = item.lightItems.map(
                        (item, key) => {
                            if (!item.key) {
                                item.key = item.lightItemId;
                            }
                            return item;
                        }
                    );
                    resolve();
                }).catch((res) => {
                    reject(res);
                })
        });
    };

    @action
    fetchTestDataList = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchTestDataList", params).then((res) => {
                this.locationList = res.data;
                this.locationList["WORLD"] = ["xxx"];
                resolve();
            }).catch((res) => {
                reject("失败")
            })
        });
    };
}

export default LightOperateStore;
