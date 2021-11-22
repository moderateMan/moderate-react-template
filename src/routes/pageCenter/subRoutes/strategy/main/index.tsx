import React, { RefObject,useEffect,useRef,forwardRef ,useImperativeHandle} from "react";
import {
  Graph,
  Shape,
  NodeView,
  Addon,
  Node,
  Line,
  Curve,
  Path,
} from "@antv/x6";
import { insertCss } from "insert-css";
import nodeCtr from "./ctr/nodeCtr";
import styles from "./index.module.scss";
import MyRect from "./shape/myRect";
import { NODE_TYPE, getNodePos, getDist } from "./common";
import { getUrlParam, uuid, game } from "@COMMON/utils";
import Relation from "./components/relationG6";
import MdView from "@ROUTES/pageCenter/subRoutes/mdView/index";
import { createRelationData } from './config';
declare var cc: any;

type PropsT = {
  [key: string]: any;
};

type StatesT = {
  [key: string]: any;
  currentItemId: string | undefined;
  nodeList: any[];
  isCheckNode: boolean;
  operatorList: any[];
  flowName: string;
};

export default class Example extends React.Component<PropsT, StatesT> {
  private graph!: Graph;
  private nodeCtr!: nodeCtr;
  private minimapContainer!: HTMLDivElement;
  private magnetAvailabilityHighlighter!: any;
  private formInstance: RefObject<any>;
  private nodeArr!: Node[];
  private nodePosArrTemp!: { x: number; y: number; itemData: Node }[];
  private isDragFlag!: boolean;
  private currentNodeId!: string;
  private isBefore!: boolean;
  private flowId!: string;
  private subNodeArr: any[] = [];
  private targetRecallId!: string | null;

  constructor(props: PropsT) {
    super(props);
    let recall_1 = this.getNodeOptionByType(NODE_TYPE.RECALL);
    let a1 = this.getNodeOptionByType(NODE_TYPE.SCOPE);
    createRelationData();
    a1 = {
      ...a1,
      connects: [
        {
          source: {
            id: recall_1.id,
            port: "port_top_1",
          },
          target: {
            id: a1.id,
            port: "port_out_1",
          },
          connector: "multi-smooth",
        },
      ],
    };
    let a2 = this.getNodeOptionByType(NODE_TYPE.SCOPE);
    a2 = {
      ...a2,
      connects: [
        {
          source: {
            id: a1.id,
            port: "port_out_1",
          },
          target: {
            id: a2.id,
            port: "port_out_1",
          },
          connector: "multi-smooth",
        },
      ],
    };
    let a3 = this.getNodeOptionByType(NODE_TYPE.SCOPE);
    a3 = {
      ...a3,
      connects: [
        {
          source: {
            id: a2.id,
            port: "port_out_1",
          },
          target: {
            id: a3.id,
            port: "port_out_1",
          },
          connector: "multi-smooth",
        },
      ],
    };
    let a4 = this.getNodeOptionByType(NODE_TYPE.SCOPE);
    a4 = {
      ...a4,
      connects: [
        {
          source: {
            id: a3.id,
            port: "port_out_1",
          },
          target: {
            id: a4.id,
            port: "port_out_1",
          },
          connector: "multi-smooth",
        },
      ],
    };
    let a5 = this.getNodeOptionByType(NODE_TYPE.SCOPE);
    a5 = {
      ...a5,
      connects: [
        {
          source: {
            id: a4.id,
            port: "port_in_1",
          },
          target: {
            id: a5.id,
            port: "port_out_1",
          },
          connector: "multi-smooth",
        },
      ],
    };
    let FIELD_0 = this.getNodeOptionByType(NODE_TYPE.FIELD);
    let FIELD_1 = this.getNodeOptionByType(NODE_TYPE.FIELD);
    let FIELD_1_1 = this.getNodeOptionByType(NODE_TYPE.FIELD);
    let FIELD_2 = this.getNodeOptionByType(NODE_TYPE.FIELD);
    let FIELD_3 = this.getNodeOptionByType(NODE_TYPE.FIELD);

    recall_1.stepNum = 0;

    recall_1.stepArr = [
      { targetId: FIELD_1.id, subArr: [a1] },
      { targetId: FIELD_1.id, subArr: [a1, a2] },
      { targetId: FIELD_1.id, subArr: [a1, a2, a3] },
      { targetId: FIELD_1.id, subArr: [a1, a2, a3, a4] },
    ];

    let testData = [
      {
        ...FIELD_1,
        connects: [
          {
            source: {
              id: FIELD_1.id,
              port: "port_out_1",
            },
            target: {
              id: FIELD_1_1.id,
              port: "port_in_1",
            },
          },
        ],
        name: "看文档",
      },
      {
        ...FIELD_1_1,
        connects: [
          {
            source: {
              id: FIELD_1_1.id,
              port: "port_out_1",
            },
            target: {
              id: recall_1.id,
              port: "port_in_1",
            },
          },
        ],
        name: "第3件事",
      },
      {
        ...recall_1,
        connects: [
          {
            source: {
              id: recall_1.id,
              port: "port_out_1",
            },
            target: {
              id: FIELD_2.id,
              port: "port_in_1",
            },
          },
        ],
      },
      {
        ...FIELD_2,
        connects: [
          {
            source: {
              id: FIELD_2.id,
              port: "port_out_1",
            },
            target: {
              id: FIELD_3.id,
              port: "port_in_1",
            },
          },
        ],
        name: "第4件事",
      },
      { ...FIELD_3, name: "第5件事" },
    ];
    this.state = {
      isRefresh: 0,
      currentItemId: "",
      isCheckNode: true,
      operatorList: [],
      nodeList: testData,
      flowName: "",
      relationDataSource:[]
    };
    // 创建表单实例
    this.formInstance = React.createRef();
    const { search } = props.location;
    this.flowId = getUrlParam(search, "id");
    // setTimeout(()=>{
    //   game("helloworld").then(()=>{

    //   })
    // },3000)
  }

  componentDidMount() {
    this.props.location;
    this.toRequestData().then(() => {
      // 高亮
      this.magnetAvailabilityHighlighter = {
        name: "stroke",
        args: {
          attrs: {
            fill: "#fff",
            stroke: "#47C769",
          },
        },
      };
      this.preWork();
      // 画布
      this.graph = this.createGraph();
      // 初始化各管理
      this.nodeCtr = new nodeCtr({ graph: this.graph });
      // 还原页面
      this.toRecoveryView();
      // // 注册事件
      this.toRegisterEvent();
      this.setState({
        isRefresh: Date.now(),
      });
    });
  }

  getNodeOptionByType(type: any): any {
    if (type == NODE_TYPE.RECALL) {
      return {
        id: uuid(),
        type: NODE_TYPE.RECALL,
        name: "回溯",
      };
    } else if (type == NODE_TYPE.FIELD) {
      return {
        id: uuid(),
        type: NODE_TYPE.FIELD,
        offsetY: -10,
        name: "知识点A",
        offsetForNode: {
          x: 10,
          y: -10,
        },
      };
    } else if (type == NODE_TYPE.SCOPE) {
      return {
        id: uuid(),
        type: NODE_TYPE.SCOPE,
        offsetY: -10,
        name: "知识点1",
        auditUserId: 1,
        auditUserEditable: 0,
        formDataEditable: 0,
        valid: 1,
      };
    }
    return {
      id: uuid(),
      type: NODE_TYPE.FIELD,
      name: "知识点",
      auditUserId: 1,
      auditUserEditable: 0,
      formDataEditable: 0,
      valid: 1,
    };
  }
  toRequestData = () => {
    return new Promise((resolve) => {
      resolve({});
    });
  };
  preWork = () => {
    // 这里协助演示的代码，在实际项目中根据实际情况进行调整
    const container = document.getElementById("containerS")!;
    const stencilContainer = document.createElement("div");
    stencilContainer.id = "stencil";
    const graphContainer = document.createElement("div");
    graphContainer.id = "graph-containerS";
    container.appendChild(stencilContainer);
    container.appendChild(graphContainer);

    insertCss(`
      #containerS {
        display: flex;
        height:50%;
        border: 1px solid #dfe3e8;
      }
      #graph-containerS {
        width: 100%;
        height: 100%!important;
      }
      .x6-widget-stencil  {
        background-color: #fff;
      }
      .x6-widget-stencil-title {
        background-color: #fff;
      }
      .x6-widget-stencil-group-title {
        background-color: #fff !important;
      }
      .x6-widget-transform {
        margin: -1px 0 0 -1px;
        padding: 0px;
        border: 1px solid #239edd;
      }
      .x6-widget-transform > div {
        border: 1px solid #239edd;
      }
      .x6-widget-transform > div:hover {
        background-color: #3dafe4;
      }
      .x6-widget-transform-active-handle {
        background-color: #3dafe4;
      }
      .x6-widget-transform-resize {
        border-radius: 0;
      }
      .x6-widget-selection-inner {
        border: 1px solid #239edd;
      }
      .x6-widget-selection-box {
        opacity: 0;
      }
    `);
  };

  componentWillUnmount() {
    let root = document.getElementById("root")!;
    let gameRoot = document.getElementById("gameRoot")!;
    gameRoot.style.display = "none";
    gameRoot.className = "gameLogin";
    root.appendChild(gameRoot);
  }
  initStenCil() {
    // #region 初始化 stencil
    let self = this;
    const stencil = new Addon.Stencil({
      title: "流程图",
      target: this.graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 240,
      collapsable: false,
      groups: [
        {
          title: "基础流程图",
          name: "group1",
          collapsable: false,
        },
      ],
      layoutOptions: {
        columns: 1,
        columnWidth: 150,
        rowHeight: 80,
      },
      getDragNode: (node) => {
        self.isDragFlag = true;
        self.nodePosArrTemp = [];
        self.nodeArr.forEach((item) => {
          const position = getNodePos(item);
          self.nodePosArrTemp.push({ ...position, itemData: item });
        });
        return node.clone({ keepId: true });
      },
      getDropNode: (node) => {
        self.isDragFlag = false;
        self.nodePosArrTemp = [];
        return node.clone({ keepId: true });
      },
      validateNode(droppingNode, options) {
        const { nodeList } = self.state;
        let temp = [...nodeList];
        // 落下的时候判断左右
        const id = nodeList.findIndex((item) => {
          return self.currentNodeId === item.id;
        });
        if (droppingNode.data.type !== NODE_TYPE.A) {
          return false;
        }
        if (id === 0) {
          temp.splice(
            id + 1,
            0,
            self.getNodeOptionByType(droppingNode.data.type)
          );
        } else if (id === temp.length - 1) {
          temp.splice(id, 0, self.getNodeOptionByType(droppingNode.data.type));
        } else {
          temp.splice(
            self.isBefore ? id : id + 1,
            0,
            self.getNodeOptionByType(droppingNode.data.type)
          );
        }
        self.setState(
          {
            nodeList: temp,
          },
          () => {
            self.toRecoveryView();
          }
        );
        return false;
      },
    });
    document.getElementById("stencil")!.appendChild(stencil.container);
    const r1 = this.nodeCtr.addNodeByType({ type: NODE_TYPE.A });
    const r2 = this.nodeCtr.addNodeByType({ type: NODE_TYPE.B });
    const r3 = this.nodeCtr.addNodeByType({ type: NODE_TYPE.C });
    stencil.load([r3, r1, r2], "group1");
  }

  getNodeCtr() {
    return this.nodeCtr;
  }

  createGraph() {
    let graph = new Graph({
      panning: true,
      autoResize: true,
      mousewheel: {
        enabled: true,
      },
      grid: true,
      container: document.getElementById("graph-containerS")!,
      highlighting: {
        magnetAvailable: this.magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#fff",
              stroke: "#31d0c6",
            },
          },
        },
      },
    });
    return graph;
  }
  handleSummit = () => {
    history.back();
  };

  toRecoveryView() {
    this.graph.clearCells();
    let startPos = {
      x: 50,
      y: 150,
    };
    this.nodeArr = [];
    const { nodeList } = this.state;
    for (let i = 0; i < nodeList.length; i++) {
      let itemData = nodeList[i];
      const { type, children = [], offsetForNode = { x: 0, y: 0 } } = itemData;
      let offsetY = type == NODE_TYPE.C ? -10 : 0;
      children.forEach((item: any, index: number) => {
        let node = this.nodeCtr
          .addNodeByType({
            type: item.type,
            options: {
              id: item.id,
              data: item,
              label: item.name,
            },
          })
          .position(startPos.x, 150 - (index + 1) * 120)
          .setAttrs({
            label: {
              textAnchor: "middle",
              textWrap: {
                width: 60,
                height: 32,
                ellipsis: true,
              },
            },
          });
        this.graph.addNode(node);
      });

      let node = this.nodeCtr
        .addNodeByType({
          type,
          options: {
            id: itemData.id,
            data: itemData,
            label: itemData.name,
          },
        })
        .position(offsetForNode.x + startPos.x + i * 130, 150 + offsetForNode.y)
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
      this.nodeArr.push(this.graph.addNode(node));
    }
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
  }

  toNextStep(step: { targetId: string; subArr: any[]; isRetain: boolean }) {
    const { targetId, subArr, isRetain } = step;
    let targetNode = this.nodeArr.find((item) => {
      return item.id === targetId;
    });
    //清理上一步的
    !isRetain &&
      this.subNodeArr.forEach((subNode: Node) => {
        subNode.remove();
      });

    if (isRetain) {
    }

    let pos = targetNode!.position();
    let arrTemp = this.nodeCtr.addNet({
      nodeList: subArr,
      startPos: { ...pos, x: pos.x - 10 },
      offset: { x: 0, y: -50 },
    });
    if (isRetain) {
      this.subNodeArr[this.subNodeArr.length - 1].removeTools();
      this.subNodeArr = [...this.subNodeArr, ...arrTemp];
    } else {
      this.subNodeArr = arrTemp;
    }
    this.subNodeArr[this.subNodeArr.length - 1].addTools({
      name: "boundary",
      height: 20,
      args: {
        padding: 3,
        attrs: {
          fill: "#7c68fc",
          stroke: "#9254de",
          strokeWidth: 1,
          fillOpacity: 0.2,
        },
      },
    });
  }

  toRemoveStep = () => {
    this.subNodeArr.forEach((subNode: Node) => {
      subNode.remove();
    });
  };

  toRegisterEvent = () => {
    let update = (view: NodeView) => {
      const cell = view.cell;
      if (cell instanceof MyRect) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id!, "portBody");
          view.unhighlight(portNode, {
            highlighter: this.magnetAvailabilityHighlighter,
          });
        });
        cell.updateInPorts(this.graph);
      }
    };

    this.graph.on("node:back", ({ e, node }: any) => {
      e.stopPropagation();
      let result = node.handleBack();
      result && this.toNextStep(result);
    });

    this.graph.on("node:forward", ({ e, node }: any) => {
      e.stopPropagation();
      let result = node.handleForward();
      result && this.toNextStep(result);
    });

    this.graph.on("edge:removed", ({ edge, options }) => {
      if (!options.ui) {
        return;
      }

      const target = edge.getTargetCell();
      if (target instanceof MyRect) {
        target.updateInPorts(this.graph);
      }
    });

    // 控制连接桩显示/隐藏
    this.graph.on("node:mouseenter", ({ node }) => {});
    this.graph.on("node:mouseleave", ({ node }) => {});

    this.graph.on("node:click", ({ e, x, y, node, cell, view }) => {
      view.highlight();
      const {
        data: { id, type },
      } = cell;
      this.setState(
        {
          currentItemId: id,
          isCheckNode: type == NODE_TYPE.A,
        },
        () => {
          let currentData = this.state.nodeList.find((item) => {
            return item.id === this.state.currentItemId;
          });
          this.formInstance?.current?.setFieldsValue(currentData);
        }
      );

      {
        // 点击的如果是回溯节点，就要显示对应回溯步骤
        let nodeData = cell.data;
        if (nodeData.type === NODE_TYPE.RECALL) {
          if (this.targetRecallId) {
            this.nodeArr.find((item) => {
              if (item.data.id === this.targetRecallId) {
                let itemTemp: any = item;
                itemTemp.hideBtn();
              }
            });
            this.toRemoveStep();
            this.targetRecallId = null;
          } else {
            this.targetRecallId = nodeData.id;
            let nodeTemp: any = node;
            nodeTemp.showBtn();
            let stepNum = nodeData.stepNum;
            let step = nodeData.stepArr[stepNum];
            this.toNextStep(step);
          }
        }
      }
    });

    this.graph.on("cell:mouseup", ({ view }) => {
      view.unhighlight();
    });

    this.graph.on("cell:mouseleave", ({ view }) => {
      view.unhighlight();
    });

    this.graph.on("cell:mouseover", ({ view }) => {
      view.unhighlight();
    });

    document.addEventListener("mousemove", (e) => {
      if (this.isDragFlag) {
        const pageX = e.pageX;
        const pageY = e.pageY;
        const p1 = this.graph.pageToLocal(pageX, pageY);
        let posArr: number[] = [];
        let nodeMap: {
          [key: number]: Node;
        } = {};
        if (!this.nodePosArrTemp.length) return;
        this.nodePosArrTemp.forEach((item) => {
          const { itemData, ...nodePos } = item;
          let dist = getDist(nodePos, p1);
          posArr.push(dist);
          nodeMap[dist] = itemData;
          this.graph.findViewByCell(itemData)?.unhighlight();
        });
        let min = Math.min(...posArr);
        let node = nodeMap[min];
        if (p1.x > getNodePos(node).x) {
          if (min > 100) return;
        } else {
          if (min > 50) return;
        }
        let view = this.graph.findViewByCell(node);
        view?.highlight();
        this.currentNodeId = node.data.id;
        this.isBefore = true;
        if (p1.x > getNodePos(node).x) {
          this.isBefore =
            Math.abs(p1.x - getNodePos(node).x) < node.size().width / 2;
        } else {
          this.isBefore = true;
        }
      }
    });
  };

  refContainer = (container: HTMLDivElement) => {
    // this.container = container;
  };

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container;
  };
  handleFormChange = (values: any) => {
    console.log("Received values of form: ", values);
    if ("auditUserEditable" in values) {
      if (values.auditUserEditable) {
        values.auditUserEditable = 1;
      } else {
        values.auditUserEditable = 0;
      }
    }
    if ("formDataEditable" in values) {
      if (values.formDataEditable) {
        values.formDataEditable = 1;
      } else {
        values.formDataEditable = 0;
      }
    }
    this.state.nodeList.find((item) => {
      if (item.id === this.state.currentItemId) {
        Object.assign(item, values);
      }
    });
    this.toRecoveryView();
  };
  render() {
    return (
      <div className={styles.app}>
        <div id="strategy_left" className={styles.content_left}>
          <div
            className={styles.content_left_top}
            id="containerS"
            ref={this.refContainer}
          />
          <Relation className={styles.content_left_bottom}></Relation>
        </div>
        <div className={styles["app-content-right"]}>
          <MdView {...this.props}></MdView>
        </div>
      </div>
    );
  }
}
