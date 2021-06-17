import React from 'react'
import useStores from "COMMON/hooks/useStores";
import { Link } from 'react-router-dom'
import { getDocPath } from 'ROUTES'

export default ({ node, inline, className, children, ...props }) => {
    const { href = "", style } = props;
    if (href.includes("http")) {
        return <a href={href} style={style}></a>
    } else {
        let strData = href.split('/')
        let folderData;
        let mdName;
        if (strData.length === 1) {
            mdName = strData[0]
        } else {
            folderData = strData.slice(0, strData.length - 1)
            mdName = strData[strData.length - 1];
        }
        const { global: { docList } } = useStores();
        let temp = getDocPath(strData, docList)
        return temp ? <Link
            to={temp}
        >
            {children}
        </Link> : <a href={href} style={style}>{children}</a>
    }
}