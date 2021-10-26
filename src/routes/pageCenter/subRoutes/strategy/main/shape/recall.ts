import { Cell, Color } from "@antv/x6";
import MyRect from "./myRect";
import "./tool";
/**
 * 回溯节点相关配置
 * 点击之后动态显示步骤，有步骤按钮可以交互。
 * @export
 * @class RecallRect
 * @extends {Myrect}
 */
export default class RecallRect extends MyRect {
  protected postprocess() {
    setTimeout(()=>{
      this.zIndex = 100
    },0)
  }
  
  handleForward(){
    this.data.stepNum = Math.min(this.data.stepArr.length-1,++this.data.stepNum);
    if(this.data.stepNum ==this.data.stepArr.length-1){
      this.setAttrs({
        buttonGroupForward: { display:"none" },
      })
    }
    this.setAttrs({
      buttonGroupBack: { display:"block" },
    })
    return this.data.stepArr[this.data.stepNum]
  }

  handleBack(){
    this.data.stepNum = Math.max(0,--this.data.stepNum);
    if(this.data.stepNum ==0){
      this.setAttrs({
        buttonGroupBack: { display:"none" },
      })
    }
    this.setAttrs({
      buttonGroupForward: { display:"block" },
    })
    return this.data.stepArr[this.data.stepNum]
  }

  showBtn(){
    this.setAttrs({
      buttonGroupForward: { display:"block" },
      buttonGroupBack: { display:"none" },
    })
  }

  hideBtn(){
    this.data.stepNum=0;
    this.setAttrs({
      buttonGroupForward: { display:"none" },
      buttonGroupBack: { display:"none" },
    })
  }

}

// 链接装配置
const ports = {
  groups: {
    out: {
      position: "right",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    in: {
      position: "left",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    top: {
      position: "top",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
    bottom: {
      position: "bottom",
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden",
          },
        },
      },
    },
  },
  items: [
    {
      group: "in",
      id: "port_in_1",
    },
    {
      group: "out",
      id: "port_out_1",
    },
    {
      group: "top",
      id: "port_top_1",
    },
    {
      group: "bottom",
      id: "port_bottom_1",
    },
  ],
};
// 覆盖默认边框颜色
RecallRect.config({
  inherit: "rect",
  width: 66,
  height: 36,
  markup: [
    //后退
    {
      tagName: 'g',
      selector: 'buttonGroupBack',
      attrs: {
        class: 'btn back',
      },
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'black',
            'pointer-events': 'none',
          },
        },
      ],
    },
    //前进
    {
      tagName: 'g',
      selector: 'buttonGroupForward',
      attrs: {
        class: 'btn forward',
        
      },
      children: [
        {
          tagName: 'rect',
          selector: 'button2',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign2',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
        
      ],
      
    },
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: '#a0a0a0',
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
    },
    buttonGroupBack: {
      refX: '-8',
      refY: '50%',
      display:"none",
    },
    button: {
      fill: '#4C65DD',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      fill:"none",
      refX: -7,
      refY: -5,
      stroke: 'white',
      strokeWidth: 1.6,
      display:"block",
      d: 'M 10 0 L 4 5 L 10 10',
    },buttonGroupForward: {
      refX: '100%',
      refY: '50%',
      display:"none",
    },
    button2: {
      fill: '#4C65DD',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign2: {
      fill:"none",
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6,
      display:"block",
      d: 'M 0 0 L 6 5 L 0 10',
      // d: 'M 1 5 9 5 M 5 1 5 9',
    },
    '.btn.back': {
      event: 'node:back',
    },
    '.btn.forward': {
     
      event: 'node:forward',
    },
  },
  ports: { ...ports },
  label: "审批",
});


