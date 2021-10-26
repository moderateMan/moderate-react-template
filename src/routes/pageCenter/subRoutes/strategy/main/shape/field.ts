import  MyRect from './myRect'
/**
 * 知识领域节点
 * 
 * @export
 * @class FieldRect
 * @extends {MyRect}
 */
export default class FieldRect extends MyRect {}

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
FieldRect.config({
  inherit: "circle",
  width: 56,
  height: 56,
  attrs: {
    body: {
      strokeWidth: 1,
      stroke: "#f2763b",
      fill: "#f1bfbf",
      rx: 28,
    },
    textWrap: {
      text: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      width: -10, // 宽度减少 10px
      height: "50%", // 高度为参照元素高度的一半
      ellipsis: true, // 文本超出显示范围时，自动添加省略号
      breakWord: true, // 是否截断单词
    },
  },
  ports: { ...ports },
  label: "创建",
})
