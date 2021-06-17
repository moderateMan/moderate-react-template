# 高阶组件:目的复用逻辑，避免重复

## formItemHoc：

> 该 hoc 将表单 form 的 item 相关的业务逻辑抽取出来，并扩展了表单配置项-columns，添加了字段-formConfig，职责就是驱动显示表单 form，简化 form 的使用方式，减轻开发难度，以便以后其他组件复用该逻辑

`配置数据的格式`：

```js
    {
                title: "EXCLUDE",//antd
                dataIndex: "exclude",//antd
                key: "exclude",//antd
                align: "left",//antd
                editable: true,//antd
                render: (value) => {
                    return <Checkbox checked={value}></Checkbox>;
                },//antd
                formConfig://extra
                {
                    valuePropName: "checked",//antd-指定初始化数据的属性名
                    rules: // antd-校验规则
                    [
                        {
                            required: true,
                            message: `Please Input EXCLUDE!`,
                        },
                    ],
                    type: "Checkbox",//extra-指定为何种组件来作为输入
                    inputAttrConfig: //extra-定制化标签的Attr
                    {
                        placeholder:
                            "这里是关于这个POS的一些描述，可以很长也可以很短，但是限制60个字段......",
                        maxLength: 60,
                    },
                },
            }
```

## intlHoc：

> 该 hoc 将国际化功能进行了封装，并批量翻译信息并注入到组件参数 props 中，字段为 intlData，免去重复 format 过程，接受参数[],值为页面国际化配置数据名，其定义在 languge 中，如 pos 页面的配置数据就为 pos。
