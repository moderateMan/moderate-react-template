import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider, inject, observer } from "mobx-react";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import language from "./language";
import stores from "@DATA_MANAGER/index";
import { iGlobal } from "@DATA_MANAGER/stores";

interface iProps {
  global?: iGlobal;
}

@inject("global")
@observer
class Root extends Component<iProps> {
  render() {
    const { locale } = this.props.global!;
    let data = language.getData();
    return (
      <IntlProvider locale={"zh"} messages={data[locale as keyof typeof data]}>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

ReactDOM.render(
  <Provider {...stores}>
    <div id="gameRoot" className="game1" style={{ display: "none" }}>
      <canvas
        id="GameCanvas"
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        tabIndex={0}
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
