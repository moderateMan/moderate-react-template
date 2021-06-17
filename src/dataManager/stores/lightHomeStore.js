import { observable, action } from "mobx";
import BaseStore from './baseStore'

class LightHomeStore extends BaseStore {
    @observable lightArr = []; //pos列表数据
    @observable pageSum = 0; //总页数
    @observable pageCount = 0; //总条数

    //请求翻页
    @action
    fetchPage = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchPage", params)
                .then((res) => {
                    debugger
                    this.lightArr = res.data.list;
                    resolve(res);
                }).catch((res) => {
                    reject(res)
                })
        });
    };

    @action
    fetchLightDelete = (params) => {
        return new Promise((resolve, reject) => {
            this.fetchApiWrapper("fetchLightDelete", params)
                .then((res) => {
                    resolve();
                }).catch((res) => {
                    reject();
                })
        });
    };
}

export default LightHomeStore;
