import { Graph, Edge, Shape } from '@antv/x6';


export default class MyRect extends Shape.Rect {
    getInPorts() {
      return this.getPortsByGroup('in');
    }
  
    getOutPorts() {
      return this.getPortsByGroup('out');
    }
  
    getUsedInPorts(graph: Graph) {
      const incomingEdges = graph.getIncomingEdges(this) || [];
      return incomingEdges.map((edge: Edge) => {
        const portId = edge.getTargetPortId();
        return this.getPort(portId!);
      });
    }
  
    getNewInPorts(length: number) {
      return Array.from(
        {
          length,
        },
        () => {
          return {
            group: 'in',
          };
        },
      );
    }
  
    updateInPorts(graph: Graph) {
      return this;
    }
  }