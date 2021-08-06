import BaseApi from './baseApi'

let config = {
    fetchPage: "/heavy/fetchPage",
    fetchLightDelete: "/heavy/fetchLightDelete",
    fetchExchange: "/heavy/fetchExchange",
    fetchStatus: "/heavy/fetchStatus",
}

export default new BaseApi({ config })