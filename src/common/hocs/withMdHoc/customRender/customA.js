import React from 'react'
import useStores from "COMMON/hooks/useStores";
import { toJS } from "mobx";
import { Link } from 'react-router-dom'

let findMd = (folder, mdName) => {
    const { subNodes } = folder;
    return subNodes.find((item) => {
        return item.name === mdName
    })
}
let findFloder = (docList, folderNames = []) => {
    let targetFolder;
    let docListTemp = docList;
    for (let i = 0; i < folderNames.length; i++) {
        let folderName = folderNames[i];
        targetFolder = docListTemp.find((item) => {
            const { name } = item;
            if (!name.includes(".md") && folderName === name) {
                return true;
            }
        }) || targetFolder
        if (targetFolder) {
            docListTemp = targetFolder.subNodes
        } else {
            break;
        }
    }
    return targetFolder;
}
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
        const { global: { docList,isHash } } = useStores();
        let docListTemp = toJS(docList);
        let folder = findFloder(docListTemp, folderData)
        let targetMd = folder && findMd(folder, mdName)
        if (targetMd) {
            const { search, param, path } = targetMd;
            let searchTemp = "";
            if (typeof search === 'object') {
                for (let key in search) {
                    searchTemp += `${searchTemp ? "&" : ""}${key}=${search[key]}`
                }
            }
            let pathnameTemp;
            //  redirect的条目排除
            {
                pathnameTemp = `${path.split("/:")[0]}${param ? ('/' + param) : ""}`
            }
            let temp = {
                pathname: pathnameTemp,
                search: searchTemp
            }
            return <Link
                to={temp}
            >
                {children}
            </Link>
        } else {
            return <a href={href} style={style}>{children}</a>
        }
    }
}