import { observable, action } from "mobx";
import { menuLocalConfig, menuRemoteConfig } from "@ROUTES/config";
class Global implements iGlobal {
  @observable menuConfig: any[] = [];
  @observable current: string = "";
  @observable scrollData: object = {};
  @observable isLogin: boolean = false;
  @observable locale: string = "zh";
  constructor(props: any) {}
  @action
  changeParams = () => {};
  @action
  getMenu = (params: any) => {
    return new Promise((resolve, reject) => {
      this.menuConfig = [...menuLocalConfig,...menuRemoteConfig];
      resolve(this.menuConfig );
    });
  };
}

export type iGlobal = {
  current: string;
  scrollData: object;
  isLogin: boolean;
  locale: string;
  changeParams: (data: any) => void;
  docTreeMap?: any[];
};

export default Global;
