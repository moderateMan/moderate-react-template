import React, { RefObject } from 'react';
import { Graph, Shape, NodeView, Addon, Node } from '@antv/x6';
import { insertCss } from 'insert-css';
import nodeCtr from './ctr/nodeCtr';
import styles from './index.module.scss';
import { Form, Select, Switch, Input, Button } from 'antd';
import MyRect from './shape/myRect';
import { NODE_TYPE, getNodePos, getDist } from './common';
import { getUrlParam, uuid } from '@COMMON/utils'

type PropsT = {
  [key: string]: any;
};

type StatesT = {
  [key: string]: any;
  currentItemId: string | undefined;
  nodeList: any[],
  isCheckNode: boolean,
  operatorList: any[],
  flowName: string
};

export default class Example extends React.Component<PropsT, StatesT> {
  private graph!: Graph;
  private nodeCtr!: nodeCtr;
  private minimapContainer!: HTMLDivElement;
  private magnetAvailabilityHighlighter!: any;
  private formInstance: RefObject<any>;
  private nodeArr!: Node[];
  private nodePosArrTemp!: { x: number; y: number, itemData: Node }[];
  private isDragFlag!: boolean;
  private currentNodeId!: string;
  private isBefore!: boolean;
  private flowId!: string;

  constructor(props: PropsT) {
    super(props);
    this.state = {
      isRefresh: 0,
      currentItemId: '',
      isCheckNode: true,
      operatorList: [],
      nodeList: [
        this.getNodeTempByType(NODE_TYPE.C),
        this.getNodeTempByType(NODE_TYPE.B)
      ],
      flowName: ""
    };
    // 创建表单实例
    this.formInstance = React.createRef();
    const { search } = props.location;
    this.flowId = getUrlParam(search, "id");
  }

  componentDidMount() {
    this.props.location
    this.toRequestData().then(() => {
      // 高亮
      this.magnetAvailabilityHighlighter = {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#47C769',
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
      this.initStenCil();
      this.setState({
        isRefresh: Date.now(),
      });
    });

  }


  getNodeTempByType(type: any) {
    if (type == NODE_TYPE.A) {
      return {
        idL: uuid(),
        type: NODE_TYPE.A,
        name: '审批',
        auditUserId: 1,
        auditUserEditable: 0,
        formDataEditable: 0,
        valid: 1
      }
    } else if (type == NODE_TYPE.B) {
      return {
        idL: uuid(),
        type: NODE_TYPE.B,
        name: '结束',
        auditUserId: 1,
        auditUserEditable: 0,
        formDataEditable: 0,
        valid: 1
      }
    } else if (type == NODE_TYPE.C) {
      return {
        idL: uuid(),
        type: NODE_TYPE.C,
        offsetY: -10,
        name: '开始',
        auditUserId: 1,
        auditUserEditable: 0,
        formDataEditable: 0,
        valid: 1
      }
    }
    return {
      idL: uuid(),
      type: NODE_TYPE.A,
      name: '审批',
      auditUserId: 1,
      auditUserEditable: 0,
      formDataEditable: 0,
      valid: 1
    }
  
  }
  toRequestData = () => {
    return new Promise((resolve) => {
      resolve({})
    })
  }
  preWork = () => {
    // 这里协助演示的代码，在实际项目中根据实际情况进行调整
    const container = document.getElementById('container')!;
    const stencilContainer = document.createElement('div');
    stencilContainer.id = 'stencil2';
    const graphContainer = document.createElement('div');
    graphContainer.id = 'graph-container';
    container.appendChild(stencilContainer);
    container.appendChild(graphContainer);

    insertCss(`
      #container {
        display: flex;
        border: 1px solid #dfe3e8;
      }
      #stencil2 {
        width:200px;
        height: 100%;
        position: relative;
        border-right: 1px solid #dfe3e8;
      }
      #graph-container {
        width: calc(100%);
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

  initStenCil() {
    // #region 初始化 stencil
    let self = this;
    const stencil = new Addon.Stencil({
      title: '流程图',
      target: this.graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 240,
      collapsable: false,
      groups: [
        {
          title: '基础流程图',
          name: 'group1',
          collapsable: false,
        },
      ],
      layoutOptions: {
        columns: 1,
        columnWidth: 150,
        rowHeight: 80,
      },
      getDragNode: (node) => {
        self.isDragFlag = true
        self.nodePosArrTemp = [];
        self.nodeArr.forEach((item) => {
          const position = getNodePos(item);
          self.nodePosArrTemp.push({ ...position, itemData: item });
        });
        return node.clone({ keepId: true });
      },
      getDropNode: (node) => {
        self.isDragFlag = false
        self.nodePosArrTemp = [];
        return node.clone({ keepId: true });
      },
      validateNode(droppingNode, options) {
        const { nodeList } = self.state;
        let temp = [...nodeList];
        // 落下的时候判断左右
        const id = nodeList.findIndex((item) => {
          return self.currentNodeId === item.idL
        })
        if (droppingNode.data.type !== NODE_TYPE.A) {
          return false
        }
        if (id === 0) {
          temp.splice(id + 1, 0, self.getNodeTempByType(droppingNode.data.type));
        } else if (id === temp.length - 1) {
          temp.splice(id, 0, self.getNodeTempByType(droppingNode.data.type));
        } else {
          temp.splice(self.isBefore ? id : id + 1, 0, self.getNodeTempByType(droppingNode.data.type));
        }
        self.setState({
          nodeList: temp
        }, () => {
          self.toRecoveryView()
        })
        return false;
      },
    });
    document.getElementById('stencil2')!.appendChild(stencil.container);
    const r1 = this.nodeCtr.addDndNode({ type: NODE_TYPE.A });
    const r2 = this.nodeCtr.addDndNode({ type: NODE_TYPE.B });
    const r3 = this.nodeCtr.addDndNode({ type: NODE_TYPE.C });
    stencil.load([r3, r1, r2], 'group1');
  }

  showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden';
    }
  };

  getNodeCtr() {
    return this.nodeCtr;
  }

  createGraph() {
    return new Graph({
      scroller: {
        enabled: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 300,
      },
      mousewheel: {
        enabled: true,
      },
      grid: true,
      container: document.getElementById('graph-container')!,
      highlighting: {
        magnetAvailable: this.magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'rounded',
        connectionPoint: 'boundary',
        router: 'orth',
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#5217b1',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
          });
        },
        validateConnection: ({ sourceView, targetView, targetMagnet }) => {
          if (!targetMagnet) {
            return false;
          }

          if (targetMagnet.getAttribute('port-group') !== 'in') {
            return false;
          }

          if (targetView) {
            const node = targetView.cell;
            if (node instanceof MyRect) {
              const portId = targetMagnet.getAttribute('port');
              const usedInPorts = node.getUsedInPorts(this.graph);
              if (usedInPorts.find((port) => port && port.id === portId)) {
                return false;
              }
            }
          }

          return true;
        },
      },
    });
  }
  handleSummit = () => {
    history.back()
  }
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
      const { type } = itemData;
      let offsetY = (type == NODE_TYPE.C ? -10 : 0);
      let node = this.nodeCtr
        .addDndNode({
          type,
          options: {
            data: itemData,
            label: itemData.name,
          },
        })
        .position(startPos.x + i * 120, 150 + offsetY)
        .setAttrs({
          label: {
            textAnchor: 'middle',
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
    for (let i = 0; i < this.nodeArr.length; i++) {
      if (i < this.nodeArr.length - 1) {
        this.graph.addEdge({
          source: { cell: this.nodeArr[i], port: 'port_out_1' }, // 源节点和链接桩 ID
          target: { cell: this.nodeArr[i + 1], port: 'port_in_1' }, // 目标节点 ID 和链接桩 ID
          attrs: {
            line: {
              stroke: '#5217b1',
              strokeWidth: 1,
              targetMarker: {
                name: 'classic',
                size: 7,
              },
            },
          },
        });
      }
    }
  }

  toRegisterEvent = () => {
    let update = (view: NodeView) => {
      const cell = view.cell;
      if (cell instanceof MyRect) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id!, 'portBody');
          view.unhighlight(portNode, {
            highlighter: this.magnetAvailabilityHighlighter,
          });
        });
        cell.updateInPorts(this.graph);
      }
    };
    this.graph.on('edge:connected', ({ previousView, currentView }) => {
      if (previousView) {
        update(previousView as NodeView);
      }
      if (currentView) {
        update(currentView as NodeView);
      }
    });

    this.graph.on('edge:removed', ({ edge, options }) => {
      if (!options.ui) {
        return;
      }

      const target = edge.getTargetCell();
      if (target instanceof MyRect) {
        target.updateInPorts(this.graph);
      }
    });

    // 控制连接桩显示/隐藏
    this.graph.on('node:mouseenter', ({ node }) => {
      const container = document.getElementById('graph-container')!;
      const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>;
      this.showPorts(ports, true);

    });
    this.graph.on('node:mouseleave', ({ node }) => {
      // node.removeTools();
      const container = document.getElementById('graph-container')!;
      const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>;
      this.showPorts(ports, false);
    });



    this.graph.on('node:click', ({ e, x, y, cell, view }) => {
      view.highlight()
      const {
        data: { idL, type },
      } = cell;
      this.setState(
        {
          currentItemId: idL,
          isCheckNode: type == NODE_TYPE.A
        },
        () => {
          let currentData = this.state.nodeList.find((item) => {
            return item.idL === this.state.currentItemId;
          });
          this.formInstance?.current?.setFieldsValue(currentData);
        },
      );
    });
    this.graph.on('cell:mouseup', ({ view }) => {
      view.unhighlight()
    });
    this.graph.on('cell:mouseleave', ({ view }) => {
      view.unhighlight()
    });

    this.graph.on('cell:mouseover', ({ view }) => {
      view.unhighlight()
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragFlag) {
        const pageX = e.pageX
        const pageY = e.pageY
        const p1 = this.graph.pageToLocal(pageX, pageY)
        let posArr: number[] = [];
        let nodeMap: {
          [key:number]: Node
        } = {};
        if (!this.nodePosArrTemp.length) return;
        this.nodePosArrTemp.forEach((item) => {
          const { itemData, ...nodePos } = item;
          let dist = getDist(nodePos, p1);
          posArr.push(dist)
          nodeMap[dist] = itemData;
          this.graph.findViewByCell(itemData)?.unhighlight()
        })
        let min = Math.min(...posArr)
        let node = nodeMap[min];
        if (p1.x > getNodePos(node).x) {
          if(min>100) return
        }else{
          if(min>50) return
        }
        let view = this.graph.findViewByCell(node)
        view?.highlight()
        this.currentNodeId = node.data.idL;
        this.isBefore = true
        if (p1.x > getNodePos(node).x) {
          this.isBefore = Math.abs(p1.x - getNodePos(node).x) < node.size().width / 2
        } else {
          this.isBefore = true
        }
      }
    })

  };

  refContainer = (container: HTMLDivElement) => {
    // this.container = container;
  };

  refMiniMapContainer = (container: HTMLDivElement) => {
    this.minimapContainer = container;
  };
  handleFormChange = (values: any) => {
    console.log('Received values of form: ', values);
    if ("auditUserEditable" in values) {
      if (values.auditUserEditable) {
        values.auditUserEditable = 1
      } else {
        values.auditUserEditable = 0
      }
    }
    if ("formDataEditable" in values) {
      if (values.formDataEditable) {
        values.formDataEditable = 1
      } else {
        values.formDataEditable = 0
      }
    }
    this.state.nodeList.find((item) => {
      if (item.idL === this.state.currentItemId) {
        Object.assign(item, values);
      }
    });
    this.toRecoveryView();
  };
  render() {
    return (
      <div className={styles.app}>
        <div style={{display:"flex"}}>
        <div className={styles["app-content"]} id="container" ref={this.refContainer} />
        <div className={styles["app-content-right"]}>
          <div className={styles["app-infoEdit"]}>
            <div>节点设置</div>
            {this.state.currentItemId && <Form
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 9, offset: 1 }}
              layout="horizontal"
              onValuesChange={this.handleFormChange}
              ref={this.formInstance}
            >
              <Form.Item
                style={{
                  marginBottom: 5,
                }}
                name="type"
                label="节点类型"
              >
                <Select disabled={!this.state.isCheckNode}>
                  <Select.Option value={NODE_TYPE.A}>审核</Select.Option>
                  <Select.Option value={NODE_TYPE.C}>创建</Select.Option>
                  <Select.Option value={NODE_TYPE.B}>结束</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="name" className={styles["custom-form-item"]} label="节点名称">
                <Input disabled={!this.state.isCheckNode} />
              </Form.Item>
              {this.state.isCheckNode && <div>
                <Form.Item name="auditUserId" className={styles["custom-form-item" ]}label="操作人">
                  <Select>
                    {
                      this.state.operatorList.map((item) => {
                        return <Select.Option value={item.id}>{item.companyName}</Select.Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item valuePropName="checked" name="auditUserEditable" className={styles["custom-form-item"]} label="审核人是否可修改">
                  <Switch />
                </Form.Item>
                <Form.Item valuePropName="checked" name="formDataEditable" className={styles["custom-form-item"]} label="表单数据是否可修改">
                  <Switch />
                </Form.Item>
              </div>}
            </Form>}

          </div>
          <div
            className={styles["app-minimapContainer"]}
            id="minimapContainer"
            ref={this.refMiniMapContainer}
          />
        </div>
        </div>
        
      </div>
    );
  }
}

