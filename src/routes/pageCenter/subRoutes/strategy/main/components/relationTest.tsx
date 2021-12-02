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
  } = useStores();
  useEffect(() => {
    var chartDom = document.getElementById("main")!;
    var myChart = echarts.init(chartDom);
    // prettier-ignore
    let dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    // prettier-ignore
    let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    let yMax = 500;
    let dataShadow = [];
    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
    let option = {
      title: {
        text: '特性示例：渐变色 阴影 点击缩放',
        subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#fff'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#999'
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      series: [
        {
          type: 'bar',
          showBackground: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          },
          data: data
        }
      ]
    };
    // Enable data zoom when user click bar.
    const zoomSize = 6;

    myChart.setOption(option);
    window.addEventListener("resize", () => {
      myChart.resize();
    });
    let a = 0;
    let b = 0.5;
    let c = 1;
    setTimeout(()=>{
      setInterval(()=>{
        a = a-0.1
        b = b-0.1
        c = c-0.1
        a=(a<0?1:a)
        b=(b<0?1:b)
        c=(c<0?1:c)
        debugger
        myChart.setOption({
          series: [
            {
              type: 'bar',
              showBackground: true,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: a, color: '#83bff6' },
                  { offset: b, color: '#188df0' },
                  { offset: c, color: '#188df0' }
                ])
              },
              emphasis: {
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ])
                }
              },
              data: data
            }
          ]
      });
    },100)
    },2000)
    

    myChart.on('mousemove', 'series', function (params) {
      console.log("123");
    });

    myChart.on("click", function (params) {});
  }, []);
  return <div id="main" className={props.className}></div>;
});
