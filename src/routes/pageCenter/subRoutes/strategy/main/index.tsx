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
  }
  render() {
    return (
      <div>
        <h1>攻略是我认为最有意思的功能</h1>
        <h1>待完成之后我使用它把我的只是体系谱写出来</h1>
        <h1>敬请期待🐱‍🏍</h1>
        </div>
    );
  }
}

export default inject(
  "global"
)(injectInternational("light")(StrategyPage));
