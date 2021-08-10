# stores 仓库：

基于mobx实现的数据托管功能，并且针对页面进行划分 __独立文件__。

## 配置

在`/stores/`下创建独立模块，其封装了基类，但是无需关注，仅配置即可，栗🌰：

```js
import BaseApi from './baseApi'

let config = {
    loginApi: "/loginApi",
    getMenuApi: "/getMenuApi",
    logoutApi: "/logoutApi",
    getCode: "/getCode"
}

export default new BaseApi({ config })

```

## 基类介绍

底层实现了诸多功能的扩展配置，如：接口防抖，请求loadding，参数校验，不同code的统一处理等：

## 注册

> 注册在文件:`/stores/index.js`中统一管理，栗🌰：

```js
...
export { default as LightHomeStore } from "./lightHomeStore";
...

```
