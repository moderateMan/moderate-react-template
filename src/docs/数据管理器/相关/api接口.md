# api 接口集合：

为后端提供的api统一配置管理，并且针对页面进行划分 __独立文件__。

## 配置

在`/api/`下创建独立模块，其封装了基类，但是无需关注，仅配置即可，栗🌰：

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

## 注册

> 注册在文件:`/api/index.js`中统一管理，栗🌰：

```js
...
export { default as lightHomeApi } from './lightHomeApi'
...

```
