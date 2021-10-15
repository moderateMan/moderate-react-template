import { Node } from '@antv/x6';
// A 审核
// B 结束
// C 开始
export const NODE_TYPE = {
    A:"1",
    C:"0",
    B:"2",
    D:"3"
}

export function getNodePos(node:Node){
    return node.getProp<{x: number; y: number}>('position')
}

export function getDist(p1:{x:number,y:number},p2:{x:number,y:number}){
    let a = p2.x-p1.x;
    let b = p2.y-p1.y;
    return Math.sqrt(a*a+b*b);
}; 
  