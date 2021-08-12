import BaseApi from "./baseApi";

let config = {
  fetchLightAdd: "/light/fetchLightAdd",
  fetchLightUpdate: "/light/fetchLightUpdate",
  fetchLightDetail: "/light/fetchLightDetail",
  fetchTestDataList: "/light/fetchTestDataList",
};

export default new BaseApi({ config });
