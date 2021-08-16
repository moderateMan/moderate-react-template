/**
* hooks.js
*/
import React, { useState, useCallback, useEffect } from "react";

const useWinSize = () => {
  // 1. 使用useState初始化窗口大小state
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });

  const changeSize = useCallback(() => {
    // useCallback 将函数缓存起来 节流
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  }, []);
  // 2. 使用useEffect在组件创建时监听resize事件，resize时重新设置state (使用useCallback节流)
  useEffect(() => {
    //绑定一次页面监听事件 组件销毁时解绑
    window.addEventListener("resize", changeSize);
    return () => {
      window.removeEventListener("resize", changeSize);
    };
  }, []);

  return size;
};

export default useWinSize;
