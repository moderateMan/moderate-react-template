import React, { useReducer } from "react";

type StateData = {
  openKeys: string[];
  selectKeys: string[];
  isEditMenu: boolean;
  remoteMenuData: any[];
  localMenuData: any[];
};

type ReducerPorps = {
  state: StateData;
  reducer?: any;
};

type PayloadT = {
  selectKeys?: string[];
  openKeys?: string[];
  remoteMenuData?:any;
  localMenuData?:any
};

type CountReducer = React.Reducer<StateData, PayloadT>;

let reducerDefalut = (state: StateData, payload: PayloadT) => {
  let temp = { ...state };
  for (let key in payload) {
    let value = payload[key as keyof typeof payload];
    if (value || typeof value === "boolean") {
      temp[key as keyof typeof payload] = value;
      if (typeof state[key as keyof typeof state] !== typeof value) {
        // console.warn(`component-menSlider-reducer，设置属性${key}的新值与初始化值类型不一致！`)
      }
    }
  }
  return temp;
};

export default function useReducerEx(props: ReducerPorps) {
  const { reducer, state } = props;
  return useReducer<CountReducer>(reducer || reducerDefalut, state);
}
