import {uuid} from '@SRC/common/utils';
let point_0 = {
    "id": uuid(),
    "value": "",
    "category": 0,
    "symbolSize": 25,
    "size": 30,
}

let point_1 = {
    "id": uuid(),
    "label": "路由",
    "value": "路由/概览.md",
    "category": 0,
    "symbolSize": 20,
    "path": "路由/概览.md",
    connect(){
        debugger
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_2 = {
    "id": uuid(),
    "label": "数据管理器",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "数据管理器/概览.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_3 = {
    "id": uuid(),
    "label": "开发规范",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "开发规范/概览.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_4 = {
    "id": uuid(),
    "label": "公共库",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "公共库/概览.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_5 = {
    "id": uuid(),
    "label": "国际化",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "国际化/开发攻略.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_6 = {
    "id": uuid(),
    "label": "cocos游戏引擎",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "cocos游戏引擎/概览.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let point_7 = {
    "id": uuid(),
    "label": "MD文档功能集成",
    "value": "",
    "category": 0,
    "symbolSize": 20,
    "path": "MD文档功能集成/概览.md",
    connect(){
        return {
            "source": this.id,
            "target": point_0.id
        }
    }
}

let data_1 = {
    "nodes": [
        {
            ...point_0
        },
        {
            ...point_1
        },
        {
            ...point_2
        },
        {
            ...point_3
        },
        {
            ...point_4
        },
        {
            ...point_5
        },
        {
            ...point_6
        },
        {
            ...point_7
        }
    ]
}

let data_2 = {
    "nodes": [
        {
            ...point_0
        },
        {
            ...point_1
        },
        {
            ...point_2
        },
        {
            ...point_3
        },
        {
            ...point_4
        },
        {
            ...point_5
        },
        {
            ...point_6
        },
        {
            ...point_7
        }
    ]
}

let data_3 = {
    "nodes": [
        {
            ...point_0
        },
        {
            ...point_1
        },
        {
            ...point_2
        },
        {
            ...point_3
        },
        {
            ...point_4
        },
        {
            ...point_5
        },
        {
            ...point_6
        },
        {
            ...point_7
        }
    ]
}

export const createRelationData = (type)=>{
   let data = data_1
    const {nodes} = data;
    let edges = [];
    nodes.forEach(nodeData => {
        edges.push(nodeData.connect?.())
    });
}





let data1 = {
    "nodes": [
        {
            ...point_0
        },
        {
            ...point_1
        },
        {
            ...point_2
        },
        {
            ...point_3
        },
        {
            ...point_4
        },
        {
            ...point_5
        },
        {
            ...point_6
        },
        {
            ...point_7
        }
    ],
    "edges": [
        {
            "source": "路由/概览.md",
            "target": "0"
        },
        {
            "source": "数据管理器/概览.md",
            "target": "0"
        },
        {
            "source": "开发规范/概览.md",
            "target": "0"
        },
        {
            "source": "公共库/概览.md",
            "target": "0"
        },
        {
            "source": "国际化/开发攻略.md",
            "target": "0"
        },
        {
            "source": "cocos游戏引擎/概览.md",
            "target": "0"
        },
        {
            "source": "MD文档功能集成/概览.md",
            "target": "0"
        }
    ],
    "categories": [
        {
            "name": ""
        }
    ]
}