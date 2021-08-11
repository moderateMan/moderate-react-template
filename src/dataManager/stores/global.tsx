import { observable, action } from "mobx";
import { menuLocalConfig, menuRemoteConfig } from "@ROUTES/config";
import BaseStore from './baseStore'
class Global extends BaseStore implements iGlobal {
  @observable menuConfig: any[] = [];
  @observable current: string = "";
  @observable scrollData: object = {};
  @observable isLogin: boolean = false;
  @observable locale: string = "zh";
 
  @action
  getMenu = (params: any) => {
    return new Promise((resolve, reject) => {
      this.menuConfig = [...menuRemoteConfig,...menuLocalConfig];
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
  formatMessage?(params:any):string
};

export default Global;
