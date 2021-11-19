# mock 模拟请求：

开发环境对接口进行进行模拟应答，能够在后台服务文档出来但还未开发完的情况下，很好的推进了前端的开发工作。同时是可配置，可插拔的，并且打包的时候会去掉的，并且针对页面进行划分 __独立文件__。

## 配置
在`/mock/`下创建独立模块，其封装了基类，但是无需关注，仅配置即可，栗🌰：

```js
import BaseMock from './baseMock'
import menuRemoteConfig from "ROUTES/menuRemoteConfig.json";

let config = {
    getMenuApi: {
        code: "200",
        data: menuRemoteConfig
    },
    loginApi: {
        code: "200",
        data: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDM0M3poIiwiaXNzIjoidXNlckdVSS0xMjM0NTY3OCFAIyQlXiYqIiwiZXhwIjoxNjEwNTI3ODg3LCJ1c2VySWQiOiIxMDM0M3poIiwiaWF0IjoxNjEwNDQxNDg3LCJqdGkiOiIxNjEwNDQxNDg3MTA5MTAzNDMifQ.ENyqU7WGRdqPoqrkUW1sEff4fBTJShJL7ot7TFmRObc",
            userId: "007"
        }
    },
    logoutApi: {
        code: "200",
        data: {}
    },
    getCode: {
        code: "200",
        data: "aaaa"
    },
}

export default function mock(api) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}
```

## 注册

> 注册在文件:`/mock/index.js`中统一管理，栗🌰：

```js
...
import lightHomeMock from "./lightHomeMock" // 引入mock
...

import {
    ...
    lightHomeApi,                           //引入api
    ...
} from 'API/'

...
lightHomeMock(lightHomeApi);                //然后mock这个api，自然直接。
...

```
