import BaseApi from './baseApi'

let config = {
    fetchPage: "/light/fetchPage",
    fetchLightDelete: "/light/fetchLightDelete",
}


export default  new BaseApi({ config })


