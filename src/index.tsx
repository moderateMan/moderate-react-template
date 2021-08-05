import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider, inject, observer } from "mobx-react";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from "antd";
import stores from "@DATA_MANAGER/index";
import { iGlobal } from "@DATA_MANAGER/stores";

interface iProps {
  global?: iGlobal;
}

@inject("global")
@observer
class Root extends Component<iProps> {
  render() {
    // const {locale} = this.props.global!
    return (
      <IntlProvider locale={"zh"}>
        <ConfigProvider>
          <App />
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

ReactDOM.render(
  <Provider {...stores}>
    <Root />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
