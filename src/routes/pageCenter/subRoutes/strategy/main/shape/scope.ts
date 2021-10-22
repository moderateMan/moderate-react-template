import  MyRect from './myRect'
/**
 * 回溯节点相关配置
 * 点击之后动态显示步骤，有步骤按钮可以交互。 
 * @export
 * @class ScopeRect
 * @extends {MyRect}
 */
export default class ScopeRect extends MyRect {}

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
ScopeRect.config({
  inherit: "rect",
  width: 75,
  height: 36,
  attrs: {
    body: {
      strokeWidth: 1,
      stroke: "#5F95FF",
      fill: "#EFF4FF",
      rx: 20,
    },
    text: {
      fontSize: 12,
      color: "#262626",
    },
  },
  ports: { ...ports },
  label: "结束",
})
