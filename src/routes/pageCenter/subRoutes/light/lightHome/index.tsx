import React, { Component } from "react";
import { Button, Row, Col } from "antd";
import { RouteComponentProps } from "react-router-dom";
import "./index.scss";
import {
  CommonTable,
  CommonWrapper,
  CommonSearchTable,
} from "@COMMON/components";

import injectInternational from "@COMMON/hocs/intlHoc";
import { WrappedComponentProps } from "react-intl";
import applyConfig from "./config";
import { getPath } from "@ROUTES/index";



type PropsT = {
  [prop: string]: any;
} & typeof injecter.type;

type LightHomePropsT = PropsT & RouteComponentProps & WrappedComponentProps;

type LightHomeStatesT = {
  intlData: any;
  searchItemArr?: any[];
  columns?: any[];
  pageIndex?: number;
  btnInTableConfig?: any[];
  pageSize?: number;
};


import { injectNaturStore } from "@DATA_MANAGER/index";
let injecter = injectNaturStore("lightHomeStoreN");

class LightHome extends Component<LightHomePropsT, LightHomeStatesT> {
  constructor(props: LightHomePropsT) {
    super(props);
    applyConfig.call(this);
  }
  selectedRows: any;
  refreshConfig: any;

  componentDidMount() {}

  handleTestNaturAsyncAction = () => {
    debugger;
    this.props.lightHomeStoreN.actions.asyncAction("测试异步响应！");
  };

  handleTestNaturSyncAction = () => {
    debugger;
    this.props.lightHomeStoreN.actions.syncAction("测试同步响应！");
  };

  componentWillUnmount() {}

  handleTableSelect = ({ selectedRows }: { selectedRows: any[] }) => {
    this.selectedRows = selectedRows.map((item) => {
      return item.lightId;
    });
  };

  handleRefreshPage = (params: any) => {
    // const {
    //     lightHomeStore: { fetchPage },
    // } = this.props;
    // const { searchPosName } = this.state;
    // props.lightName = searchPosName;
    // fetchPage(params).finally(() => {
    // });
  };

  handlDelete = (params: any) => {
    // const {
    //     lightHomeStore: { lightArr, fetchLightDelete },
    //     intlData,
    // } = this.props;
    // if (params.length === 0) {
    //     return message.warning(intlData["light_warn_select"]);
    // }
    // let { pageIndex, pageSize } = this.state;
    // Modal.confirm({
    //     icon: <InfoCircleOutlined />,
    //     title: intlData.modalDeleteTitle,
    //     content: intlData.modalDeleteContent,
    //     cancelText: intlData.No,
    //     okText: intlData.Yes,
    //     onOk: () => {
    //         fetchLightDelete(params).then(() => {
    //             if (params.length === lightArr.length) {
    //                 pageIndex = pageIndex - 1;
    //             }
    //             this.handleRefreshPage({
    //                 pageIndex: pageIndex || 1,
    //                 pageSize: pageSize,
    //             });
    //         });
    //     },
    // });
  };

  handleSearch = (values: any) => {
    //TODO 查询
  };

  handleTableAddBtnClick = () => {
    const { history, intlData } = this.props;
    history.push(
      getPath("lightAdd", {
        search: `?title=${intlData["light_addTitle"]}`,
      })
    );
  };

  handleTableDeleteBtnClick = () => {
    this.handlDelete(this.selectedRows);
  };

  componentDidUpdate() {
    // const { intlData } = this.props;
    // if (this.state.intlData !== intlData) {
    //   this.setState({ intlData }, () => {
    //     this.refreshConfig();
    //   });
    // }
  }
  render() {
    // const {
    //   form,
    //   lightHomeStore: { lightArr, pageSum = 5 },
    //   intlData,
    // } = this.props;
    // const {
    //   searchItemArr,
    //   columns,
    //   pageIndex,
    //   btnInTableConfig,
    //   pageSize = 0,
    // } = this.state;
    return (
      <div>
        <CommonWrapper>
          {/* <CommonSearchTable
            dataSource={searchItemArr}
            handleSearch={this.handleSearch}
          /> */}
          <div style={{ marginBottom: 100 }}>
            Natur的仓库-lightHomeStore中的数据
            {this.props.lightHomeStoreN?.state?.testValue || "..."}
          </div>
          <Row>
            <Col span={12}>
              <Button onClick={this.handleTestNaturAsyncAction}>
                测试Natur的异步Action
              </Button>
            </Col>
            <Col span={12}>
              <Button onClick={this.handleTestNaturSyncAction}>
                测试Natur的同步Action
              </Button>
            </Col>
          </Row>
        </CommonWrapper>
        {/* <CommonWrapper title={intlData["light_listTitle"]}>
          <CommonTable
            btnInTableConfig={btnInTableConfig}
            handleTableSelect={this.handleTableSelect}
            pagination={{
              pageSizeOptions: ["5", "10", "15"],
              current: pageIndex,
              total: pageSum * pageSize,
              pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (current: number, size: number) => {
                this.setState(
                  {
                    pageIndex: 1,
                    pageSize: size,
                  },
                  () => {
                    this.handleRefreshPage({
                      pageIndex: 1,
                      pageSize: size,
                    });
                  }
                );
              },
              onChange: (page: any, pageSize: any) => {
                this.setState({
                  pageIndex: page,
                });
                this.handleRefreshPage({
                  pageIndex: page,
                  pageSize: pageSize,
                });
              },
            }}
            data={toJS(lightArr) || []}
            columns={columns}
          />
        </CommonWrapper> */}
      </div>
    );
  }
}

export default injecter(injectInternational("light")(LightHome));
