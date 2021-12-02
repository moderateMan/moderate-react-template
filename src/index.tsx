import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider, inject, observer } from "mobx-react";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import language from "./language";

interface iProps {
  global?: any;
}

// @inject("global")
// @observer
class Root extends Component<iProps> {
 render() {
    // const { state:locale } = this.props.global!;
    let data = language.getData();
    return (
      <IntlProvider locale={"zh"} messages={data["zh"]}>
        <ConfigProvider>
          <App/>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

ReactDOM.render(
  <Provider >
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
