
import React, { useMemo } from 'react'

export default function computeNum({ values, handler }) {
    // 通过依赖列表变化 useMemo 重新计算结果达到计算属性实时更新
    const computed = useMemo(() => handler(values), [...Object.entries(values)])
    return (
        <div>{computed}</div>
    )
}
