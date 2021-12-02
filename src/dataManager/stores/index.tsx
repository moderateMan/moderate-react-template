export { default as LightHomeStore } from "./lightHomeStore";
export { default as Global } from "./global";



export type iGlobal = {
  current: string;
  scrollData: object;
  isLogin: boolean;
  locale: string;
  changeParams: (data: any) => void;
  docTreeMap?: any[];
  isHash?:boolean;
  formatMessage?(params: any): string;
};