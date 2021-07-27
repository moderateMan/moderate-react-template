import { useRef, useEffect } from 'react';
import _ from 'lodash';
export function useDeepCompareEffect(fn, deps) {
    // 使用一个数字信号控制是否渲染，简化 react 的计算，也便于调试
    let renderRef = useRef;
    let depsRef = useRef(deps);
    if (!_.isEqual(deps, depsRef.current)) {
        renderRef.current++;
    }
    depsRef.current = deps;
    return useEffect(fn, [renderRef.current]);
}