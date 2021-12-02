import React, { useEffect, useRef } from "react";
import G6, { IG6GraphEvent } from '@antv/g6';
import data from './relationDataG6.json'
import useStores from "@COMMON/hooks/useStores";
import { withRouter, RouteComponentProps } from "react-router-dom";

type PropsT = {
  [key: string]: any;
} & RouteComponentProps;

export default withRouter((props: PropsT) => {
  const {
    global: { docList },
  } = useStores() as any;
  useEffect(() => {
    const container = document.getElementById('main');
    const width = container!.scrollWidth;
    const height = container!.scrollHeight || 500;
    const graph = new G6.Graph({
      container: 'main',
      width,
      height,
      fitView:true
,      layout: {
        type: 'gForce',
        minMovement: 0.01,
        damping: 0.99,
        linkDistance:80,
        nodeStrength:1500,
        preventOverlap: true,
      },
      modes: {
        default: ['drag-canvas', 'drag-node', 'zoom-canvas'],
      },
    });


    const nodes = data.nodes;
    // randomize the node size
    nodes.forEach((node: any) => {
      node.size = node.size||30;
      node.labelCfg = {position:"right"}
    });
    graph.data({
      nodes,
      edges: data.edges.map(function (edge:{
        source: string;
        target: string;
        [key:string]:any
    }, i) {
        edge.id = 'edge' + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    graph.on('node:dragstart', function (e) {
      graph.layout();
      refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
      const forceLayout = graph.get('layoutController').layoutMethods[0];
      forceLayout.execute();
      refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e:IG6GraphEvent) {
      e.item!.get('model').fx = null;
      e.item!.get('model').fy = null;
    });


    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };

    function refreshDragedNodePosition(e:any) {
      const model = e.item.get('model');
      model.fx = e.x;
      model.fy = e.y;
    }
  }, []);
  return <div id="main" className={props.className}></div>;
});

