import React, { Fragment } from "react";
import { inject, observer } from "mobx-react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { HashRouter, BrowserRouter } from "react-router-dom";
import { Modal } from "antd";
const { confirm } = Modal;
import Routes from "./routes";
import { iGlobal } from "@DATA_MANAGER/stores";
import "./App.css";
import './global.d'

window.GAME_FLAG = "";

type iProps = {
  global?: iGlobal;
} & WrappedComponentProps;

const App: React.FC<iProps> = (props) => {
  
  const { global } = props;
  const { isHash } = global!;
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
  };
  return (
    <Fragment>
      {isHash ? (
        <HashRouter getUserConfirmation={getConfirmation}>
          <Routes />
        </HashRouter>
      ) : (
        <BrowserRouter getUserConfirmation={getConfirmation}>
          <Routes />
        </BrowserRouter>
      )}
    </Fragment>
  );
};

export default injectIntl(inject("global")(observer(App)));
