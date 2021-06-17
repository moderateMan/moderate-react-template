import BaseApi from './baseApi'

let config = {
    fetchHeavyAdd: "/heavy/fetchHeavyAdd",
    fetchUpdate: "/heavy/fetchUpdate",
    fetchDetail: "/heavy/fetchDetail",
    fetchHeavyInit: "/heavy/fetchHeavyInit",
}

export default new BaseApi({ config })