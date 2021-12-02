//Nietzsche once said, don't always talk about yourself.
import React, { useEffect, useRef } from "react";
import useStores from "@COMMON/hooks/useStores";
import { withRouter, RouteComponentProps } from "react-router-dom";
import testData from "./relationData.json";
import * as echarts from "echarts";

let nodeShape = () => {
  return {
    id: "0",
    name: "overView",
    value: "",
    category: 0,
    symbolSize: 20,
  };
};

let linkTemp = () => {
  return {
    source: "1",
    target: "0",
  };
};

type PropsT = {
  [key: string]: any;
} & RouteComponentProps;

export default withRouter((props: PropsT) => {
  const {
    global: { docList },
  } = useStores() as any;
  useEffect(() => {
    var chartDom = document.getElementById("main")!;
    var myChart = echarts.init(chartDom);
    let option = {
      title: {
        text: "关系图",
        subtext: "Default layout",
        top: "bottom",
        left: "right",
      },
      tooltip: {},
      legend: [
        {
          // selectedMode: 'single',
          data: testData.categories.map(function (a) {
            return a.name;
          }),
        },
      ],
      series: [
        {
          name: "Moderate",
          type: "graph",
          layout: "force",
          data: testData.nodes,
          links: testData.links,
          categories: testData.categories,
          roam: true,
          zoom: 1,
          draggable: true,
          label: {
            position: "right",
            show: true,
          },
          force: {
            repulsion: 1000,
          },
        },
      ],
    };

    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });

    myChart.on("click", function (params) {});
  }, []);
  return <div id="main" className={props.className}></div>;
});
