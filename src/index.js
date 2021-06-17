/**
 * 文件名称: src/index.js
 *
 * 文件描述:入口文件
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, inject, observer } from "mobx-react";
import { IntlProvider, addLocaleData } from "react-intl";
import language from "./language";
import { ConfigProvider } from "antd";
import antdZhCN from "antd/lib/locale-provider/zh_CN";
import antdEnUS from "antd/lib/locale-provider/en_US";
import App from "./App";
import store from "DATA_MANAGER";
import "./index.scss"

const antdLanguageMap = {
  zh: antdZhCN,
  en: antdEnUS,
};

@inject("global")
@observer
class Root extends Component {
  render() {
    const {
      global: { locale },
    } = this.props;
    return (
      <IntlProvider locale={locale} messages={language.getData()[locale]}>
        <ConfigProvider locale={antdLanguageMap[locale]}>
          <App />
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

ReactDOM.render(
  <Provider {...store}>
    <div id="gameRoot" className="game1" style={{ display: "none" }}>
      <canvas
        id="GameCanvas"
        onContextMenu={(event) => {
          event.preventDefault()
        }}
        tabIndex="0"
      ></canvas>
      <div id="splash">
        <div className="progress-bar stripes">
          <span style={{ width: "0%" }}></span>
        </div>
      </div>
    </div>
    <Root />
  </Provider>,
  document.getElementById("root")
);
