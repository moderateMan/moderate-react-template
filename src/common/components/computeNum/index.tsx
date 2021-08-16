import React, { useMemo, useRef } from "react";

//TODOCME why is no error when the T and P not use
export default function computeNum<T, P>({
  values,
  handler,
}: {
  values: T;
  handler: (params: T) => P;
}) {
  let ref = useRef<HTMLDivElement>(null);
  // 通过依赖列表变化 useMemo 重新计算结果达到计算属性实时更新
  const computed = useMemo(() => handler(values), [...Object.entries(values)]);
  return <div ref={ref}>{computed}</div>;
}
