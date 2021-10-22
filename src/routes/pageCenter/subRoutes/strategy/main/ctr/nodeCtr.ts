import { Graph } from "@antv/x6";
import RecallRect from "../shape/recall";
import FieldRect from "../shape/field";
import ScopeRect from "../shape/scope";
import { NODE_TYPE } from "../common/index";

type nodeCtrPropsT = {
  graph: Graph;
};

export default class NodeCtr {
  private graph!: Graph;
  private createNodeHandler!: any;
  constructor(props: nodeCtrPropsT) {
    this.graph = props.graph;
    this.createNodeHandler = {
      [NODE_TYPE.RECALL]: this.createNodeByType,
      [NODE_TYPE.SCOPE]: this.createNodeByType,
      [NODE_TYPE.FIELD]: this.createNodeByType,
    };
    this.toRegisterNode();
  }

  toRegisterNode(){
    //注册 回溯节点
    Graph.registerNode(
      'recall',
      RecallRect,
      true
    )
    //注册 知识区域
    Graph.registerNode(
      'scope',
      ScopeRect,
      true
    )
    //注册 技术学科
    Graph.registerNode(
      'field',
      FieldRect,
      true
    )
  }

  addNodeByType({ type, options }: { type: string; options?: any }) {
    return this.createNodeHandler[type]({ type, options });
  }

  createNodeByType = ({type,options}:{type:string,options:any})=>{
    return this.graph.createNode({
      shape: type,
      ...options,
    });
  }

  addNet(data: { nodeList: any[]; startPos?: any; offset?: any }) {
    const {nodeList,startPos={x:0,y:0},offset={x:0,y:0}} = data;
    let arr = [];
    //建点
    for (let i = 0; i < nodeList.length; i++) {
      let itemData = nodeList[i];
      const { type, children = [] } = itemData;
      let node = this.createNodeByType({
          type,
          options: {
            id: itemData.id,
            data: itemData,
            label: itemData.name,
          },
        })
        .position(startPos.x+offset.x, startPos.y+offset.y*(i+1))
        .setAttrs({
          label: {
            textAnchor: "middle",
            text: itemData.name,
            textWrap: {
              width: 60,
              height: 32,
              ellipsis: true,
            },
          },
        });
        arr.push(this.graph.addNode(node));
    }

    //建线
    for (let i = 0; i < nodeList.length; i++) {
      let itemData = nodeList[i];
      const { connects = [] } = itemData;
      connects.forEach((item: any) => {
        const { source, target } = item;
        let connector = target.connector;
        this.graph.addEdge({
          source: { cell: source.id, port: source.port }, // 源节点和链接桩 ID
          target: { cell: target.id, port: target.port }, // 目标节点 ID 和链接桩 ID
          connector,
          attrs: {
            line: {
              stroke: "#5217b1",
              strokeWidth: 1,
              targetMarker: {
                name: "classic",
                size: 7,
              },
            },
          },
        });
      });
    }

    return arr;
  }
}
