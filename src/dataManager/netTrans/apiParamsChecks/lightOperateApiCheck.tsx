import BaseApiShape from './baseApiCheck'


let config = {
    fetchTestDataList: {
        reqParam: {
            type: {},//不写默认是对象
            p1: {
                type: "string",//要求是什么类型，传入类型名，否者直接取传入变量的类型
            },
            p2: {
                type: {},
            },
            p13: {
                type: "string",//要求是什么类型，传入类型名，否者直接取传入变量的类型
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
    fetchLightDetail: {
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
