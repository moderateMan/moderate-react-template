import React, { Component } from "react";
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, message, Button } from "antd";
import "./index.scss";
import { CommonTable, CommonWrapper, CommonSearchTable } from "COMMON/components";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import injectInternational from "COMMON/hocs/intlHoc";
import applyConfig from "./config";
import { getPath } from "ROUTES";

const EditableContext = React.createContext();
@Form.create()
@injectInternational("light")
@inject("lightHomeStore", "global")
@observer
class LightHome extends Component {
    constructor(props) {
        super(props);
        applyConfig.call(this);
    }

    componentDidMount() {
        this.handleRefreshPage({
            pageIndex: 1,
            pageSize: this.state.pageSize,
        });
        this.props.form.validateFields();
    }

    componentWillUnmount() { }

    handleTableSelect = ({ selectedRows }) => {
        this.selectedRows = selectedRows.map((item) => {
            return item.lightId;
        });
    };

    handleRefreshPage = (props) => {
        const {
            lightHomeStore: { fetchPage },
        } = this.props;
        const { searchPosName } = this.state;
        props.lightName = searchPosName;
        fetchPage(props).finally(() => {
        });
    };

    handlDelete = (params) => {
        const {
            lightHomeStore: { lightArr, fetchLightDelete },
            intlData,
        } = this.props;
        if (params.length === 0) {
            return message.warning(intlData["light_warn_select"]);
        }
        let { pageIndex, pageSize } = this.state;
        Modal.confirm({
            icon: <InfoCircleOutlined />,
            title: intlData.modalDeleteTitle,
            content: intlData.modalDeleteContent,
            cancelText: intlData.No,
            okText: intlData.Yes,
            onOk: () => {
                fetchLightDelete(params).then(() => {
                    if (params.length === lightArr.length) {
                        pageIndex = pageIndex - 1;
                    }
                    this.handleRefreshPage({
                        pageIndex: pageIndex || 1,
                        pageSize: pageSize,
                    });
                });
            },
        });
    };

    handleSearch = (values) => {
        //TODO 查询
    };

    handleTableAddBtnClick = () => {
        const { history, intlData } = this.props;
        history.push(getPath("lightAdd", {
            search: `?title=${intlData["light_addTitle"]}`,
        }));
    };

    handleTableDeleteBtnClick = () => {
        this.handlDelete(this.selectedRows);
    };

    componentDidUpdate() {
        const { intlData } = this.props;
        if (this.state.intlData !== intlData) {
            this.setState({ intlData }, () => {
                this.refreshConfig();
            })
        }
    }
    render() {
        const {
            form,
            lightHomeStore: { lightArr, pageSum = 5 },
            intlData,
        } = this.props;
        const {
            searchItemArr,
            columns,
            pageIndex,
            btnInTableConfig,
            pageSize,
        } = this.state;

        return (
            <div>
                <EditableContext.Provider value={form}>
                    <CommonWrapper>
                        <CommonSearchTable
                            dataSource={searchItemArr}
                            handleSearch={this.handleSearch}
                        />
                    </CommonWrapper>
                    <CommonWrapper title={intlData["light_listTitle"]}>
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
                                onShowSizeChange: (current, size) => {
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
                                onChange: (page, pageSize) => {
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
                    </CommonWrapper>
                </EditableContext.Provider>
            </div>
        );
    }
}

export default LightHome;
