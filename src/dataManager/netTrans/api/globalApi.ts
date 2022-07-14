import BaseApi from "./baseApi";

let config = {
  loginApi: "/login",
  getMenuApi: "/sysmenu/queryByRole",
  logoutApi: "/userOut",
  getCode: "/getCode",
  register:"/proxy/users/register",
  checkSession:"/proxy/users/checkSession"
};

export default new BaseApi({ config });
