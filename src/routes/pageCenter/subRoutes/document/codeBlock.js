// import React, { PureComponent } from "react";
// import PropTypes from "prop-types";
// import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
// // 设置高亮样式
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
// // 设置高亮的语言
// import { jsx, javascript, sass, scss } from "react-syntax-highlighter/dist/esm/languages/prism";

// class CodeBlock extends PureComponent {
//     static propTypes = {
//         value: PropTypes.string.isRequired,
//         language: PropTypes.string
//     };

//     static defaultProps = {
//         language: null
//     };

//     componentWillMount() {
//         // 注册要高亮的语法，
//         // 注意：如果不设置打包后供第三方使用是不起作用的
//         SyntaxHighlighter.registerLanguage("jsx", jsx);
//         SyntaxHighlighter.registerLanguage("javascript", javascript);
//     }

//     render() {
//         const { language, value } = this.props;
//         return (
//             <figure className="highlight">
//                 <SyntaxHighlighter language={language} style={dark}>
//                     {value}
//                 </SyntaxHighlighter>
//             </figure>
//         );
//     }
// }

// export default CodeBlock;

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
/* Use `…/dist/cjs/…` if you’re not in ESM! */
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const components = {
    code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
        ) : (
            <code className={className} {...props} />
        )
    }
}

export default components;