/**
 * 文件名称: app.js
 *
 * 文件描述:app组件
 *
 * @class App
 */
import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { HashRouter, Route, Switch, Redirect, useHistory } from "react-router-dom";
import Routes from "./routes";
import { Modal } from "antd";
import "./index.scss";


const { confirm } = Modal;
@inject("global")
@observer
@injectIntl
class App extends React.Component {
    componentDidMount() {
        const {
            intl: { formatMessage },
            global: { changeParams },
        } = this.props;
        changeParams({ formatMessage })
        this.handleKeyboard();
    }

    constructor(props) {
        super(props);
    }

   
    /**
     * 处理键盘事件，防止IE等浏览器点击退格键时，页面后退
     */

    handleKeyboard = () => {
        document.onkeypress = this.doKey;
        document.onkeydown = this.doKey;
    };

    /**
     * 监听点击的是否为退格或者当前是否为输入域
     * 并做出相应的处理
     * @param e
     * @returns {boolean}
     */
    doKey = (e) => {
        const ev = e || window.event;
        const obj = ev.target || ev.srcElement;
        const t = obj.type || obj.getAttribute("type");
        if (
            ev.keyCode === 8 &&
            t !== "password" &&
            t !== "text" &&
            t !== "textarea"
        ) {
            return false;
        }
    };

    getConfirmation = (message, callback) => {
        confirm({
            title: message,
            content: "",
            okText: 'Yes',
            cancelText: 'No',
            onOk() {
                callback(true);
            },
            onCancel() {
                callback(false);
            },
        })
    };

    /**
     * react 页面加载方法
     * 应用Switch组件进行路由控制
     * @returns {*}
     */
    render() {
        return <HashRouter getUserConfirmation={this.getConfirmation}>
            <Routes />
        </HashRouter>
    }
}
export default App;
