# apiParamsChecks schema核验参数：

针对请求接口的入参和出参进行数据结构和类型上的校验，支持嵌套结构，并将结果输出到`console`中，并且针对页面进行划分 __独立文件__。

## 开发使用

在`/apiParamsChecks/`下创建独立模块，其封装了基类，但是无需关注，仅配置即可，栗🌰：

```js
import BaseApiShape from './baseApiCheck'

let config = {
    getMenuApi: {
        reqParam: {
            type: {},                                   //不写默认是对象
            p1: {
                type: "string",                         //要求是什么类型，传入类型名，否者直接取传入变量的类型
            },
            p2: {
                type: {},
            },
            p13: {
                type: "string",                         //要求是什么类型，传入类型名，否者直接取传入变量的类型
            },
        },
        resParam: {
            p1: {
                type: [],
            },
            p2: {
                type: {},
            }
        }
    },
    loginApi: {                                         //嵌套也行
        resParam: {
            type: [],
            _item: {
                lightItems: {
                    type: [],
                    _item: {
                        exclude: {
                            type: "boolean",
                        }
                    },
                },
                aaaaa: {
                    type: {},
                }
            }
        }
    }
}

export default new BaseApiShape({ config })

```

## 注册

> 注册在文件:`/apiParamsChecks/index.js`中统一管理，栗🌰：

```js
...
export {default as lightOperateApiCheck} from "./lightOperateApiCheck"
...

```