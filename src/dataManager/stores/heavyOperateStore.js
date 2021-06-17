import { observable, action } from "mobx";
import { showPartAItem } from "COMMON/shapes";
import api from "API/heavyOperateApi";
import BaseStore from './baseStore'

class heavyOperateStore extends BaseStore {
    @observable tableLoading; //表格加载
    @observable btnDisabled;
    @observable pageSum; //总页数
    @observable pageCount; //总条数
    @observable lightList; //
    @observable linkSelectOptionList; //
    @observable lightOptionArr; //
    @observable showPartBItemArr; //
    @observable targetNodeId; //
    @observable targetShowPartAId; //
    @observable heavyDataPart1; //
    @observable heavyDataPart2; //

    constructor(props) {
        super(props)
        this.initialAllObservableState();
    }

    @action
    initialAllObservableState = () => {
        this.tableLoading = false;
        this.btnDisabled = false;
        this.pageSum = 1;
        this.pageCount = 0;
        this.editingKey = undefined;
        this.isNewAddFlag = false;
        this.lightList = [];
        this.linkSelectOptionList = [];
        this.lightOptionArr = [];
        this.showPartBItemArr = [];
        this.heavyDataPart1 = {};
        this.heavyDataPart2 = {
            showPartA: [showPartAItem()],
        };
        this.targetNodeId = 0;
        this.targetShowPartAId = 0;
    };

    transformOptionArr = () => {
        this.lightOptionArr = this.lightList.map((item) => {
            const { lightId, lightName } = item;
            return [lightId, lightName];
        });
    };

    @action
    fetchInitEx = (params) => {
        return Promise.all([this.fetchInit()]);
    };

    @action
    fetchInit = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchHeavyInit", params)
                    .then((res) => {
                        if (res.code !== "200") {
                        }
                        const {
                            lightList,
                            linkSelectOptionList,
                        } = res.data || {};
                        this.lightList = lightList;
                        this.linkSelectOptionList = linkSelectOptionList;
                        resolve();
                    })

            });
        }
    };

    @action
    fetchAdd = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchHeavyAdd", params)
                    .then((res) => {
                        resolve(res);
                    })
            });
        }
    };

    @action
    fetchUpdate = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchUpdate", params)
                    .then((res) => {
                        if (res.code !== "200") {
                        } else {
                            resolve();
                        }
                    })
                    .finally(() => {
                        this.changeParams({
                            tableLoading: false,
                            btnDisabled: false,
                        });
                    });
            });
        }
    };

    @action
    fetchDetail = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchDetail", params)
                    .then((res) => {
                        debugger
                        const { showPartA, ...rest } = res.data;
                        this.changeParams({
                            heavyDataPart1: { ...rest },
                            heavyDataPart2: { showPartA },
                        });
                        resolve();
                    })
                    .finally(() => {
                        this.changeParams({
                            tableLoading: false,
                            btnDisabled: false,
                        });
                    });
            });
        }
    };
}

export default heavyOperateStore;
