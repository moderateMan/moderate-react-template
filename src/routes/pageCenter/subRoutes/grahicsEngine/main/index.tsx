import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import "./index.scss";
import { observer, inject } from "mobx-react";
import injectInternational from "@COMMON/hocs/intlHoc";
import { WrappedComponentProps } from "react-intl";
import applyConfig from "./config";

type PropsT = {
  [prop: string]: any;
} & RouteComponentProps & WrappedComponentProps;

type StatesT = {
  intlData: any;
};

@observer
class StrategyPage extends Component<PropsT, StatesT> {
  constructor(props: PropsT) {
    super(props);
    applyConfig.call(this);
  }
  render() {

    return (
      <div>123</div>
    );
  }
}

export default inject(
  "global"
)(injectInternational("light")(StrategyPage));
