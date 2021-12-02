import baseStore from "./baseStore";
import { menuLocalConfig, menuRemoteConfig } from "@ROUTES/config";

class global extends baseStore {
  state = {
    number: 0,
    menuConfig: [],
  };

  maps = {
    isEven: ["number", (number: number) => number % 2 === 0],
  };

  actions = {
    inc: (number: number) => ({ number: number + 1 }),
    dec: (number: number) => ({ number: number - 1 }),
    getMenu: (params: any) => {
      return new Promise((resolve, reject) => {
        let data: any = [];
        if (this.state.menuConfig.length === 0) {
          data = [...menuRemoteConfig, ...menuLocalConfig];
        }
        resolve({
          number:"显示这个，就说明ok了",
        });
      });
    },
  };
}

export default global;
