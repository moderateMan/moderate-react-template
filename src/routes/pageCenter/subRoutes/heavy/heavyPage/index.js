import React, { Component } from "react";
import { Modal, message } from "antd";
import "./index.scss";
import { Form, Icon } from "antd";
import {CommonTable,CommonWrapper,CommonSearchTable} from "COMMON/components";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import applyConfig from "./config";
import injectInternational from "COMMON/hocs/intlHoc";
import { getPath } from 'ROUTES';

const EditableContext = React.createContext();

@injectInternational("heavy")
@inject("heavyHomeStore", "global")
@observer
class HeavyPage extends Component {
    constructor(props) {
        super(props);
        applyConfig.call(this);
    }

    componentDidMount() {
        const {
            global,
            heavyHomeStore: { initialAllObservableState },
        } = this.props;
        initialAllObservableState();
        this.handleRefreshPage({
            pageIndex: 1,
            pageSize: this.pageSize,
        });
        global.changeParams({
            isLoading: true,
        });
        this.props.form.validateFields();
    }

    componentWillUnmount() { }
    handleTableSelect = ({ selectedRows }) => {
        this.selectedRows = selectedRows.map((item) => {
            return item.heavyId;
        });
    };

    handleRefreshPage = (props) => {
        const {
            global,
            heavyHomeStore: { fetchPage },
        } = this.props;
        const { searchParam1, searchParam2, searchParam3 } = this.state;
        props.heavyName = searchParam1;
        props.baseSelect = searchParam2;
        props.status = searchParam3;
        fetchPage(props).finally(() => {
            global.changeParams({
                isLoading: false,
            });
        });
    };

    handlDelete = (params) => {
        const {
            heavyHomeStore: { heavyArr, fetchDelete },
            intlData,
        } = this.props;
        if (params.length === 0) {
            return message.warning(intlData.warn_select);
        }
        let { pageIndex, pageSize } = this.state;
        Modal.confirm({
            icon: <Icon type="info-circle" />,
            title: intlData.modalDeleteTitle,
            content: intlData.modalDeleteContent,
            cancelText: intlData.No,
            okText: intlData.Yes,
            onOk: () => {
                fetchDelete(params).then(() => {
                    if (params.length === heavyArr.length) {
                        pageIndex = pageIndex - 1;
                    }
                    this.handleRefreshPage({
                        pageIndex: pageIndex || 1,
                        pageSize,
                    });
                });
            },
        });
    };

    handleSearch = (values) => {
        const { heavyHomeStore } = this.props;
        const { searchParam1, searchParam2, searchParam3 } = values;
        this.setState(
            {
                pageIndex: 1,
                searchParam1: searchParam1,
                searchParam2,
                searchParam3,
            },
            () => {
                this.handleRefreshPage({
                    pageIndex: 1,
                    pageSize: this.state.pageSize,
                });
            }
        );
    };
    handleTableAddBtnClick = () => {
        const { history, intlData } = this.props;
        let path  = getPath("heavyAdd", { search: `?title=${intlData.heavyPage_newheavy}` });
        history.push(path);
    };
    handleTableDeleteBtnClick = () => {
        this.handlDelete(this.selectedRows);
    };
    handleExchange({ data, option, rowIndex }) {
        const {
            heavyHomeStore: { fetchExchange, fetchPage, heavyArr, fetchPageEx },
        } = this.props;
        const { pageIndex, pageSize } = this.state;
        let toRequestData = ({ ori, des, option }) => {
            let params = { option };
            params.oriId = ori.heavyId;
            params.desId = des.heavyId;
            fetchExchange(params).then(() => {
                fetchPage({
                    pageIndex,
                    pageSize,
                });
            });
        };
        if (option === -1) {
            if (rowIndex == 0) {
                return;
            }
            toRequestData({
                ori: data,
                des: heavyArr[rowIndex - 1],
                option,
            });
        } else {
            if (rowIndex != heavyArr.length - 1) {
                toRequestData({
                    ori: data,
                    des: heavyArr[rowIndex + 1],
                    option,
                });
            } else {
                fetchPageEx({
                    pageIndex: pageIndex + 1,
                    pageSize,
                }).then((nextArr) => {
                    toRequestData({
                        ori: data,
                        des: nextArr[0],
                        option,
                    });
                });
            }
        }
    }
    handleSwitchStatus = (params) => {
        const { heavyId, status } = params;
        const { pageIndex, pageSize } = this.state;
        const {
            heavyHomeStore: { fetchStatus, fetchPage },
        } = this.props;
        fetchStatus({
            heavyId,
            status,
        }).then(() => {
            fetchPage({
                pageIndex,
                pageSize,
            });
        });
    };
    componentDidUpdate(){
        const {intlData} = this.props;
        if(this.state.intlData !== intlData){
            this.setState({intlData},()=>{
                this.refreshConfig();
            })
        }
    }
    render() {
       
        const {
            form,
            heavyHomeStore: { test, heavyArr, pageSum = 5 },
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
                            style={{}}
                            dataSource={searchItemArr}
                            handleSearch={this.handleSearch}
                        />
                    </CommonWrapper>
                    <CommonWrapper title={intlData.heavyPage_heavyList}>
                        <CommonTable
                            other={{ scroll: { x: 1300 } }}
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
                            data={toJS(heavyArr) || []}
                            columns={columns}
                        />
                    </CommonWrapper>
                </EditableContext.Provider>
            </div>
        );
    }
}

export default Form.create()(HeavyPage);
