import { Graph } from '@antv/x6';
import MyRect from '../shape/myRect';
import { NODE_TYPE } from '../common/index';

type nodeCtrPropsT = {
  graph: Graph;
};
const ports = {
  groups: {
    out: {
      position: 'right',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
    in: {
      position: 'left',
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#5F95FF',
          strokeWidth: 1,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          },
        },
      },
    },
  },
  items: [
    {
      group: 'in',
      id: 'port_in_1',
    },
    {
      group: 'out',
      id: 'port_out_1',
    },
  ],
};
export default class NodeCtr {
  private graph!: Graph;
  private dndNodeF!: any;
  private nodeF!: any;
  constructor(props: nodeCtrPropsT) {
    this.graph = props.graph;
    this.dndNodeF = {
      [NODE_TYPE.A]: this.addNndNodeA,
      [NODE_TYPE.B]: this.addNndNodeB,
      [NODE_TYPE.C]: this.addNndNodeC,
    };
    this.nodeF = {
      [NODE_TYPE.A]: this.getNodeA,
      [NODE_TYPE.B]: this.getNodeB,
      [NODE_TYPE.C]: this.getNodeC,
    };
  }

  addNode(data?: { options?: any }) {
    const { options } = data || {};
    if (options) {
      return this.graph.addNode(options);
    } 
    return this.graph.addNode(this.addNndNodeA());
  }

  addNndNodeA = (options?: any) => {
    let optionsTemp = {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          rx: 5,
        },
        text: {
          fontSize: 12,
          color: '#262626',
        },
      },
      ports: { ...ports },
      label: '审批',
      data:options,
      ...options,
    };
    return new MyRect(optionsTemp);
  };

  addNndNodeB = (options?: any) => {
    let optionsTemp = {
      inherit: 'rect',
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          rx: 20,
        },
        text: {
          fontSize: 12,
          color: '#262626',
        },
      },
      ports: { ...ports },
      label: '结束',
      data:options,
      ...options,
    };
    return new MyRect(optionsTemp);
  };
  addNndNodeC = (options?: any) => {
    let optionsTemp = {
      inherit: 'circle',
      width: 56,
      height: 56,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#f2763b',
          fill: '#f1bfbf',
          rx: 28,
        },
        textWrap: {
          text: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
          width: -10,      // 宽度减少 10px
          height: '50%',   // 高度为参照元素高度的一半
          ellipsis: true,  // 文本超出显示范围时，自动添加省略号
          breakWord: true, // 是否截断单词
        }
      },
      ports: { ...ports },
      label: '创建',
      data:options,
      ...options,
    };
    return new MyRect(optionsTemp);
  };

  addDndNode({ type, options }: { type: string; options?: any }) {
    return type in this.dndNodeF ? this.dndNodeF[type](options||{type}) : this.addNndNodeA(options||{type});
  }

  getNode({ type, ele }: { type: string; ele: HTMLDivElement }) {
    return type in this.nodeF ? this.nodeF[type]({ ele }) : this.getNodeA({ ele });
  }

  getNodeA = (options?: any) => {
    return new MyRect(options);
  };

  getNodeB = (options?: { ele?: HTMLDivElement } | undefined) => {
    let ele;
    if (options?.ele) {
      ele = options.ele;
      ele.style.margin = '16px';
      ele.style.cursor = 'move';
    } else {
      ele = document.createElement('div');
    }
    ele.style.width = '120px';
    ele.style.height = '40px';
    ele.style.display = 'flex';
    ele.style.alignItems = 'center';
    ele.style.justifyContent = 'center';
    ele.style.border = '2px solid rgb(49, 208, 198)';
    ele.style.background = '#fff';
    ele.style.borderRadius = '20px';
    ele.innerText = 'Circle';
    return ele;
  };

  getNodeC = (options?: { ele?: HTMLDivElement } | undefined) => {
    let ele;
    if (options?.ele) {
      ele = options.ele;
      ele.style.margin = '16px';
      ele.style.cursor = 'move';
    } else {
      ele = document.createElement('div');
    }
    ele.style.width = '80px';
    ele.style.height = '80px';
    ele.style.display = 'flex';
    ele.style.alignItems = 'center';
    ele.style.justifyContent = 'center';
    ele.style.border = '2px solid rgb(49, 208, 198)';
    ele.style.background = '#fff';
    ele.style.borderRadius = '100%';
    ele.innerText = 'Circle';
    return ele;
  };
}
