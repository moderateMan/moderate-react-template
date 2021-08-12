import BaseApi from "./baseApi";

let config = {
  loginApi: "/login",
  getMenuApi: "/sysmenu/queryByRole",
  logoutApi: "/userOut",
  getCode: "/getCode",
};

export default new BaseApi({ config });
