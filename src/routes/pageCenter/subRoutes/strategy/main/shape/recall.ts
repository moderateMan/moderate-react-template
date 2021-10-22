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
export default class RecallRect extends MyRect {}

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
  attrs: {
    body: {
      strokeWidth: 1,
      stroke: "#5F95FF",
      fill: "#EFF4FF",
      rx: 5,
    },
    text: {
      fontSize: 12,
      color: "#262626",
    },
    text2: {
      fontSize: 12,
      color: "#262626",
      display: "none",
    },
  },
  tools: [
    {
      name: "editableCell",
      args: {
        x: 100,
        y: 100,
      },
    },
    {
      name: "button",
      args: {
        markup: [
          {
            tagName: "circle",
            selector: "button",
            attrs: {
              r: 10,
              stroke: "#fe854f",
              strokeWidth: 2,
              fill: "white",
              cursor: "pointer",
            },
          },
          {
            tagName: "text",
            textContent: ">",
            selector: "icon",
            attrs: {
              fill: "#fe854f",
              fontSize: 10,
              textAnchor: "middle",
              pointerEvents: "none",
              y: "0.3em",
              display: "none",
            },
          },
        ],
        x: "100%",
        y: "100%",
        offset: { x: -5, y: -22 },
        onClick({ cell }: { cell: Cell }) {
          type ToolItem = {
            name: string;
            args: any;
          };
          let tools = cell.getTools()!.items[0] as ToolItem;
          let markupTemp = tools.args.markup[0];
          let ddd = markupTemp.attr;
          markupTemp.fill = "black";
          markupTemp.r = 1;
          const {
            data: { handleNext },
          } = cell;
          cell.attr({
            text: {},
          });
          let a = 1;
          (() => {
            a++;
            handleNext && handleNext(cell.data);
          })();
        },
      },
    },
    {
      name: "button",
      args: {
        markup: [
          {
            tagName: "circle",
            selector: "button",
            attrs: {
              r: 10,
              stroke: "#fe854f",
              strokeWidth: 2,
              fill: "white",
              cursor: "pointer",
            },
          },
          {
            tagName: "text",
            textContent: "<",
            selector: "icon",
            attrs: {
              fill: "#fe854f",
              fontSize: 10,
              textAnchor: "middle",
              pointerEvents: "none",
              y: "0.3em",
            },
          },
        ],
        x: "100%",
        y: "100%",
        offset: { x: -69, y: -22 },
        onClick({ cell }: { cell: Cell }) {},
      },
    },
  ],
  ports: { ...ports },
  label: "审批",
});
