import { observable, action } from "mobx";
import api from "API/heavyHomeApi";
import BaseStore from './baseStore'

class heavyHomeStore extends BaseStore {
    @observable tableLoading; //表格加载
    @observable btnDisabled;
    @observable heavyArr; //pos列表数据
    @observable pageSum; //总页数
    @observable pageCount; //总条数
    @observable test; //总条数

    constructor(props) {
        super(props)
        this.initialAllObservableState();
    }

    @action
    initialAllObservableState = () => {
        this.tableLoading = false;
        this.btnDisabled = false;
        this.heavyArr = [];
        this.pageSum = 0;
        this.pageCount = 0;
        this.test = "test"
    };


    @action
    testFunc = (value) => {
        this.test = value;
    }

    transPosData = (data) => {
        return data.map((item) => {
            const { heavyId, heavyName } = item;
            item.key = heavyId;
            item.no = heavyId;
            item.heavyName = heavyName;
            return item;
        });
    };

    //请求翻页
    @action
    fetchPage = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchPage", params)
                    .then((res) => {
                        const { code, data } = res;
                        const { result, pager = {} } = data || {};
                        const { pageCount } = pager || {};
                        if (result) {
                            if (result.length) {
                                this.heavyArr = this.transPosData(result);
                            }
                            this.pageSum = pageCount;
                        } else {
                            this.changeParams({
                                heavyArr: [],
                                pageSum: 0,
                                pageCount: 0,
                            });
                        }
                        resolve();
                    }).catch(() => {
                        reject();
                    })
            });
        }
    };

    @action
    fetchPageEx = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchPage", params)
                    .then((res) => {
                        const { code, data } = res;
                        const { result, pager = {} } = data || {};
                        const { pageCount } = pager || {};
                        resolve(this.transPosData(result));
                    }).catch((data) => {
                        reject(data);
                    })
            });
        }
    };

    @action
    fetchDelete = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchLightDelete", params)
                    .then((res) => {
                        resolve();
                    }).catch((data) => {
                        reject(data);
                    })
            });
        }
    };

    @action
    fetchExchange = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                this.fetchApiWrapper("fetchExchange", params)
                    .then((res) => {
                        resolve();
                    }).catch((data) => {
                        reject(data);
                    })
            });
        }
    };

    @action
    fetchStatus = (params) => {
        if (!this.tableLoading) {
            return new Promise((resolve, reject) => {
                api.fetchStatus(params)
                    .then((res) => {
                        resolve();
                    }).catch((data) => {
                        reject(data);
                    })
            });
        }
    };
}

export default heavyHomeStore;
