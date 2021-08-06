import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'
import { customImg, customA, customAboutMe } from './customRender'

// 生成在一个范围内的随机数
function frandom(min, max) {
    // 加一包含最大值  不加1不包含最大值
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let defalult = themes.materialDark;
let themesValues = Object.values(themes);
let images = ["https://s1.imagehub.cc/images/2021/06/13/663FF258-A077-4124-A6CB-DA3281A1667C991d2ad8f91247c0.jpg"]


const components = ({ isRandomTheme }) => {
    return {
        code({ node, inline, className, children, ...props }) {
            let theme = isRandomTheme ? themesValues[frandom(0, themesValues.length)] : defalult;
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter style={theme} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
            ) : (
                <code className={className} {...props} >{children[0]}</code>
            )
        },
        img: customImg,
        a: customA,
        aboutme: customAboutMe
    }
}
export default components;