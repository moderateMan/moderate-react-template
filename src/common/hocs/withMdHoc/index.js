import React, { Component } from "react"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeComponents from './plugins/rehype-components'
import gfm from 'remark-gfm'
import codeBlock from "./codeBlock";
import styles from "./index.module.scss"
import { h } from 'hastscript'

const DocumentationPage = (properties, children) =>
  h("article.documentation", [h("button", properties.title), ...children]);

function wrapperByMd({ md, ...rest }) {
    return <ReactMarkdown
        className={styles.markdown_body}
        children={md}
        rehypePlugins={[rehypeRaw,[rehypeComponents,{components:{
            "info-box": DocumentationPage
        }}]]}
        remarkPlugins={[gfm]}
        components={{...codeBlock(rest)}}
    />
}

const WithMdHoc = (WrappedComponent) => {
    return class WithMd extends Component {
        wrapperByMd = wrapperByMd
        render() {
            const props = Object.assign({}, this.props, {
                wrapperByMd: this.wrapperByMd,
            });
            return <div style={{ marginBottom: 30 }}><WrappedComponent {...props} /></div>;
        }
    };
};

export default WithMdHoc;

export const useWrapperByMd = () => {
    return wrapperByMd;
}
