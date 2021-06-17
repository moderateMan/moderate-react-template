import React, { useReducer } from "react";
let reducerDefalut = (state, payload) => {
    let temp = {...state}
    for (let key in payload) {
        let value = payload[key];
        if (value||typeof value==="boolean") {
            temp[key] = value;
            if (typeof state[key] !== typeof value) {
                // console.warn(`component-menSlider-reducer，设置属性${key}的新值与初始化值类型不一致！`)
            }
        }
    }
    return temp;
}
export default function useReducerEx(props) {
    const { reducer,state} = props;
    return useReducer(reducer||reducerDefalut,state)
}
