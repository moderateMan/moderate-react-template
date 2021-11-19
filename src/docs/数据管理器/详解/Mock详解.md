# 前端 mock
现在开发模式一般都是前后端分离，那就免不了互相“迁就”，比如说后台只把接口文档大体定好了，接口还没出，作为前端的不能傻等着啊，但是不联调的去开发，很多细节就照顾不到，很容易就出现临近快交工的时候才出接口（这里不能狭隘的认为后台故意地，就是菜而已），当联调的时候才发现很多问题，那就太尴尬了，如果延误了，锅很容易就盖在了前端的头上，得想个辙：

* “请”后台加快速度并保证质量，这是一种办法，每次都要嘱托一下，拜托拜托。(往往没什么卵用图个心安。。。)
* 自己mock接口，更好地和后台“异步”开发，快速推进前端工作进度，尽早的暴露问题，给自己争取更多的时间去解决。

---

# 怎么用 mock

首先安装`mockjs`

```shell
	yarn add -D mockjs
```


然后看一下自己的网络请求库用的是啥：

__axios__:
```js
	...
	import Mock from 'mockjs'
	...
	
	Mock.mock(apiUrl, mock)
	...
```

__fetch__：就得特殊处理一下

首先安装`mockjs-fetch`
```shell
	yarn add -D mockjs-fetch
```

然后
```js
	...
	import Mock from 'mockjs'
        import mockFetch from 'mockjs-fetch';
        mockFetch(Mock);
	...
	Mock.mock(apiUrl, mock)
```

到此基本操作就搞定了，但这还不够。

---

# 怎么优雅的用 mock

我看过很多的项目，往往是写了一堆。。。。栗🌰：

```js
import Mock from 'mockjs'
import { builder, getBody } from '../util'

const login = options => {
  const body = getBody(options)
  return builder(
    {
      id: Mock.mock('@guid'),			//这个@是mockJs的占位符，可以到官网了解一下，这个不重要，我们主要codeReview
      name: Mock.mock('@name'),
      username: 'admin',
      password: '',
      avatar:
        'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
      status: 1,
      telephone: '',
      lastLoginIp: '27.154.74.117',
      lastLoginTime: 1534837621348,
      creatorId: 'admin',
      createTime: 1497160610259,
      deleted: 0,
      roleId: 'admin',
      lang: 'zh-CN',
      token: '4291d7da9005377ec9aec4a71ea837f'
    },
    '',
    200
  )
}



Mock.mock(/\/auth\/login/, 'post', login)

```


首先咱们品评一下，不知道是不是我的“审美”怪，我看这样的代码多少有点别扭。

## codeReview一下：

1. 首先在头部引入了`mockjs`
2. 然后引入了两个工具函数,咱先不管干嘛的
	```js
	import { builder, getBody } from '../util'
	```
3. `Mock.mock(/\/auth\/login/, 'post', login)`然后执行了mock

__评价__：
1. em～～～，每写一个mock模块就引一下`mockjs`库，重复了虽然就一条，__但还算能忍__。
2. em～～～，为啥要引工具函数呢，为啥还要了解工具函数，还是两个！如果为了实现超出基本mock的功能范畴，那讲不了，但就是 __单纯mock__ ，这就有点。。。，__难忍了__。
3. what！！！，mock的接口地址居然“硬了”，想想硬编码所支配的恐惧，这简直，__不能忍，不能忍__ ！！！

__总结__：

重复（哪怕只有几条），关注的点多（哪怕只有几个），硬编码（哪怕只有一处），有能力重构就不能忍，我们只是想mock数据，直接点，自然一点不好么，就像字面那样，我想“mock”一个“api”。



## 如果一个api是这样的：

```js
import BaseApi from './baseApi'

let config = {
    fetchLightAdd: "/light/fetchLightAdd",
    fetchLightUpdate: "/light/fetchLightUpdate",
    fetchLightDetail: "/light/fetchLightDetail",
    fetchTestDataList: "/light/fetchTestDataList",
}

export default new BaseApi({ config })
```

## 那么期望mock的样子应该是这样的：

```js
import BaseMock from './baseMock'

let config = {
    fetchLightAdd: {
       ...
    },
    fetchLightUpdate: {
       ...
    },
    fetchLightDetail: (data) => {
        const { body = {} } = data;
        let params = JSON.parse(body);
        //在这里就各种模拟入参情况发挥不同结果。
        if (params.id === "0") {
            return {
                code: "200",
                data: [{
                    lightName: "test_lightName_0",
                    comment: "test_comment_0",
                    lightItems: [{ lightItemId: 1, lightType: 0, baseSelect: 1, exclude: false }]
                }]
            }
        } else if (params.id === "1") {
            return {
                code: "200",
                data: [{
                    lightName: "test_lightName_1",
                    comment: "test_comment_1",
                    lightItems: [{ lightItemId: 1, lightType: 0, baseSelect: 0, exclude: 0 }, { lightItemId: 2, lightType: 1, baseSelect: 1, exclude: false }]
                }]
            }
        }

    },
    fetchTestDataList: {
        ...
    }
}

export default function mock(api) {
    new BaseMock({ config, apiConfig: api.getUrlConfig() })
}

```

## 我们再codeReview一下：

1. 首先每个文件都引入了mockjs：解决🆗，em～～～只不过取而代之的是引入了`BaseMock`😂，（本来这句我都想省，但就担心代码搞的不好懂了，要不我差点拔刀🐶）
2. 关注点多：解决🆗
3. 硬编码：解决🆗

__总结__：就是一个简单的数据结构，提供给你，配就完了，想mock哪个接口，就写这个接口名字，真是字面那样：我想“mock”一个“api”，其他不需要你关注了，就这么简单且自然。

---

# 别忘了 mock 只在开发模式用。

## 根据环境动态引入：

```js
{
    /* 配置mock启动 */
    const { NODE_ENV, MOCK } = process.env;
    if (NODE_ENV === "development") {
        if (MOCK != "none") {
            require('MOCK');
        }
    }
}
```

## 发布打包的时候去掉，包体小点不好么：

配置webpak的选项：
```js
 //isEnvProduction根据process.env.NODE_ENVde值判断得到的
 externals:isEnvProduction?{
            mockjs:mockjs
 }:{}
```

## 打包我们看下：

首先[Moderate](https://juejin.cn/post/6974675882841473038)打包速度还是很快的，才21s，嘿嘿😁
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe0923e60be94245b32d45179e6264e8~tplv-k3u1fbpfcp-zoom-1.image)

然后看下报告：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a00d43d3181f47d1b844d03b420ceec9~tplv-k3u1fbpfcp-zoom-1.image)

---

# 结语

要求别人不如要求自己来的实际,mock确实能缓解不少压力，前端不容易，ta的难还不是那种～～～难，ta真的是那种，那种很少见的那种，神经病一样的难度。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a3618b450ad4c4ab84c9029c946bcbf~tplv-k3u1fbpfcp-zoom-1.image)


[贯彻思想的🌰](https://github.com/moderateReact/moderate-react-template)

