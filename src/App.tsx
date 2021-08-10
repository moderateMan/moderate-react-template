import React from "react";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import {
  HashRouter,
} from "react-router-dom";
import { Modal } from "antd";
const { confirm } = Modal;
import Routes from "./routes";
import "./App.css";

const App: React.FC = () => {
  let getConfirmation = (message: string, callback: (ok: boolean) => void) => {
        confirm({
          title: message,
          content: "",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            callback(true);
          },
          onCancel() {
            callback(false);
          },
        });
      }
  return <HashRouter getUserConfirmation={getConfirmation}> <Routes /></HashRouter>
}


export default injectIntl(inject("global")(observer(App)));
