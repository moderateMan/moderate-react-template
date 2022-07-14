//Nietzsche once said, don't always talk about yourself.
import React, { useEffect, useRef } from 'react'
import useStores from "@COMMON/hooks/useStores";
import { withRouter } from 'react-router-dom'
import * as echarts from 'echarts';
import { getDocPath } from '@ROUTES'

let nodeShape = () => {
    return {
        "id": "0",
        "name": "overView",
        "value": "",
        "category": 0,
        symbolSize :20
    }
}

let linkTemp = () => {
    return {
        "source": "1",
        "target": "0"
    }
}

function getData(props) {
    let { rootName, paths } = props;
    paths = JSON.parse(paths)
    let nodes = [{ ...nodeShape(), name: rootName,symbolSize:25 }];
    let links = []
    paths.forEach((item,index) => {
        let node = nodeShape()
        let link = linkTemp()
        nodes.push({ ...node, ...item, id: item.path })
        links.push({ ...link, source: item.path })
    })
    return {
        nodes,
        links,
        categories: [
            {
                "name": ""
            }
        ]
    }
}

export default withRouter((props) => {
    const { global: { docList } } = useStores();
    useEffect(() => {
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        let graph = getData(props)
        let option = {
            title: {
                text: '概览',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                // selectedMode: 'single',
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }],
            series: [
                {
                    name: 'Moderate',
                    type: 'graph',
                    layout: 'force',
                    data: graph.nodes,
                    links: graph.links,
                    categories: graph.categories,
                    roam: true,
                    zoom: 1,
                    draggable: true,
                    label: {
                        position: 'right',
                        show: true
                    },
                    force: {
                        repulsion: 1000
                    }
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener("resize", () => {
            myChart.resize()
        });
        
        myChart.on('click', function (params) {
            const {data:{path}} = params;
            const { history } = props;
            if(path){
                let pathData = getDocPath(path.split('/'),docList)
                history.push(pathData)
            }
        })
    }, [])
    return <div id="main" style={{ height: 500 }}></div>
})