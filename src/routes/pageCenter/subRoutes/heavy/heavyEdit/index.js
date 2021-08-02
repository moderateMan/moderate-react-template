import React, { Component } from "react";
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Form, Button, Row, Col, message, Modal, Radio } from "antd";
import { observer, inject } from "mobx-react";
import debounce from "lodash/debounce";
import { objectExistValue, getUrlParam } from "COMMON/utils";
import { showPartAItem } from "COMMON/shapes";
import { CommonWrapper, CommonFormTable } from "COMMON/components";
import { withIntlHoc } from "COMMON/hocs";
import { ShowPartA, SliderMenu, DrawerTable } from './components'
import LightDetail from "ROUTES/pageCenter/subRoutes/light/lightEdit";
import pageConfig from "./config";
import { getPath } from "ROUTES";
import "./index.scss";

const { confirm } = Modal;

@withIntlHoc("heavy")
@inject("heavyOperateStore", "global")
@observer
class HeavyEdit extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        pageConfig.call(this);
        const {
            location: { pathname = "" },
        } = this.props;
        //通过url地址判断当前是修改还是新增
        this.isEdit = pathname.includes("edit") || pathname.includes("detail");
        this.isDetail =
            !pathname.includes("edit") && pathname.includes("detail");
        this.showAByNodeList = [];
    }

    componentDidMount() {
        const {
            location: { pathname, search },
            heavyOperateStore: { fetchDetail, fetchInit },
            global,
        } = this.props;
        this.heavyId = getUrlParam(search, "heavyId");
        if (pathname == "/pageCenter/heavyPage/detail") {
            this.setState({
                isJustShow: true,
            });
        }
        fetchInit().then(() => {
            if (this.isEdit) {
                fetchDetail({
                    heavyId: this.heavyId,
                }).then(() => {
                    this.refreshConfig();
                })
            } else {
                this.refreshConfig();
            }
        });

    }

    componentWillUnmount() {
        const {
            heavyOperateStore: { initialAllObservableState },
        } = this.props;
        initialAllObservableState();
    }

    filterItsByNode(arr) {
        let temp = [];
        arr.forEach((item, index) => {
            !(item.nodeId - 1 in temp) && (temp[item.nodeId - 1] = []);
            temp[item.nodeId - 1].push(item);
        });
        return temp;
    }

    handleSubItemClick = ({ nodeId, showPartAId }) => {
        const {
            heavyOperateStore: { changeParams },
        } = this.props;
        changeParams({
            targetNodeId: nodeId,
            targetShowPartAId: showPartAId,
        });
    };

    handleOpenChange = (params) => {
        this.setState({
            openKeys: params,
        });
    };

    updateHeavyDataPart2 = () => {
        const {
            heavyOperateStore: { changeParams },
        } = this.props;
        let newHeavyShowAArr = [];
        this.showAByNodeList.forEach((itArr) => {
            newHeavyShowAArr = [...newHeavyShowAArr, ...itArr];
        });
        changeParams({
            heavyDataPart2: {
                showPartA: newHeavyShowAArr,
            },
        });
    };

    handleUpdateNodeList = (data) => {
        const {
            heavyOperateStore: { targetNodeId, targetShowPartAId },
        } = this.props;
        if (data.topFormPart == 3) {
            let dataTemp = showPartAItem();
            if (!data.showPartCList || data.showPartCList.length === 0) {
                data.showPartCList = dataTemp.showPartCList;
            }
            if (
                !data.showPartBList ||
                data.showPartBList.length === 0
            ) {
                data.showPartBList = dataTemp.showPartBList;
            }
        }
        this.showAByNodeList[targetNodeId][targetShowPartAId] = data;
        this.updateHeavyDataPart2();
    };
    handleItSwitch = (dragItem, trgetItem) => {
        const { nodeId: dragNodeId, showAId: dragItId } = dragItem;
        const { nodeId: targetNodeId, } = trgetItem;

        if (dragNodeId == targetNodeId) {
            return;
        }
        const radioStyle = {
            display: "block",
            height: "30px",
            lineHeight: "30px",
        };
        let switchCheckIDTemp =
            this.showAByNodeList[dragNodeId - 1].length === 1 ? 1 : 0;
        const {
            heavyOperateStore: { changeParams },
        } = this.props;
        this.setState({
            switchCheckID: switchCheckIDTemp,
        }, () => {
            changeParams({
                targetNodeId: 0,
                targetShowPartAId: 0,
            })
        });
        Modal.confirm({
            icon: <InfoCircleOutlined />,
            title: "请确定操作",
            content: (
                <div>
                    <Radio.Group
                        defaultValue={switchCheckIDTemp}
                        onChange={(e) => {
                            this.setState({
                                switchCheckID: e.target.value,
                            });
                        }}
                    >
                        {this.showAByNodeList[dragNodeId - 1].length !== 1 && (
                            <Radio style={radioStyle} value={0}>
                                移动
                            </Radio>
                        )}
                        <Radio style={radioStyle} value={1}>
                            复制
                        </Radio>
                    </Radio.Group>
                </div>
            ),
            onOk: () => {
                const { intlData } = this.props;
                if (this.state.switchCheckID == 0) {
                    this.showAByNodeList[dragNodeId - 1].splice(dragItId, 1);
                    const {
                        heavyOperateStore: { changeParams },
                    } = this.props;
                    changeParams({
                        targetShowPartAId: 0,
                    });
                    this.updateHeavyDataPart2();
                }
                this.handleItAdd(targetNodeId, dragItem.itemData);
            },
        });
    };
    handleSwitchClick = (value) => {
        this.setState({
            isSort: value
        })
    }
    handleItAdd = (nodeId, newItem = "") => {
        let self = this;
        const {
            heavyOperateStore: { changeParams },
            intlData,
        } = this.props;
        if (this.showAByNodeList[nodeId - 1].length === 4) {
            return message.warning(intlData["heavyPage_warnNum"]);
        }
        newItem = newItem || showPartAItem();
        self.showAByNodeList[nodeId - 1].push({
            ...newItem,
            nodeId: nodeId,
        });
        this.updateHeavyDataPart2();
    };
    handleItDelete = (params) => {
        const { intlData } = this.props;
        const { nodeId, showAId } = params;
        if (this.showAByNodeList[nodeId - 1].length === 1) {
            return message.warning(intlData["heavyPage_leastOneWarn"]);
        }
        confirm({
            title: intlData["heavyPage_delecteWarn"],
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                this.showAByNodeList[nodeId - 1].splice(showAId, 1);
                const {
                    heavyOperateStore: { changeParams },
                } = this.props;
                changeParams({
                    targetShowPartAId: 0,
                });
                this.updateHeavyDataPart2();
            },
            onCancel() { },
        });
    };
    handleNodeAdd = () => {
        const { intlData } = this.props;
        if (this.showAByNodeList.length === this.maxNodeNum) {
            return message.warning(intlData["heavyPage_nodeNum"]);
        }
        this.showAByNodeList.push([
            {
                ...showPartAItem(),
                nodeId: this.showAByNodeList.length + 1,
            },
        ]);
        this.updateHeavyDataPart2();
    };
    handleNodeDelete = ({ nodeId }) => {
        const { intlData } = this.props;
        if (this.showAByNodeList.length === 1) {
            return message.warning(intlData["heavyPage_leastOne"]);
        }
        confirm({
            title: intlData["heavyPage_delWarnNode"],
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                this.showAByNodeList.splice(nodeId, 1);
                let newList = [];
                this.showAByNodeList.forEach((item) => {
                    newList.push(item);
                });
                newList.forEach((item, index) => {
                    item.forEach((itemB) => {
                        itemB.nodeId = index + 1;
                    });
                });
                const {
                    heavyOperateStore: { changeParams },
                } = this.props;
                changeParams({
                    targetNodeId: 0,
                    targetShowPartAId: 0,
                });
                this.showAByNodeList = newList;
                this.updateHeavyDataPart2();
            },
            onCancel() { },
        });
    };

    handleFSClick = (data, type) => {
        this.setState({
            modalType: type,
            filterModalData: data,
        });
    };

    handleSave = () => {
        const { validateFields } = this.formRef.current;
        validateFields().then((error, data) => {
            const { history } = this.props;
            if (!error && objectExistValue(data)) {
                const {
                    heavyOperateStore: {
                        fetchAdd,
                        fetchUpdate,
                        heavyDataPart2,
                    },
                    intlData,
                } = this.props;
                const { effectDate = [] } = data;
                data.status = data.status ? 1 : 0;
                if (effectDate && effectDate.length) {
                    data.effectStartDate = effectDate[0].format("YYYYMMDD");
                    data.effectEndDate = effectDate[1].format("YYYYMMDD");
                }
                let params = { ...heavyDataPart2, ...data };
                this.setState(
                    {
                        isOk: true,
                    },
                    () => {
                        if (this.isEdit) {
                            fetchUpdate({
                                ...params,
                                heavyId: this.heavyId,
                            }).then(() => {
                                message.success({
                                    content: intlData["heavyPage_succeed"],
                                });
                                history.goBack();
                            });
                        } else {
                            fetchAdd(params).then(() => {
                                message.success({
                                    content: intlData["heavyPage_succeed"],
                                });
                                history.goBack();
                            });
                        }
                    }
                );
            }
        });
    };

    getItemModal = (props, itemData) => { };

    handleSwitchDrawerShow = (value, type, data) => {
        this.setState({
            drawerTableType: type,
            isShowDrawer: value,
            targetDetailId: data,
        });
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
            heavyOperateStore: {
                heavyDataPart2,
                targetNodeId,
                targetShowPartAId,
                linkSelectOptionList,
            },
            intlData,
            ...rest
        } = this.props;

        const {
            location: { search },
        } = rest;
        const {
            drawerTableType,
            formItemArr,
            isJustShow = false,
            openKeys,
            isShowDrawer,
        } = this.state;
        const { showPartA = [] } = heavyDataPart2;
        if (showPartA.length === 0) return <div>no</div>;
        this.showAByNodeList = this.filterItsByNode(showPartA);
        let title = getUrlParam(decodeURIComponent(search), "title");
        let drawerPageProps = {
            title: {
                lightDetail: intlData.heavyPage_lightDetail,
                light: intlData.heavyPage_lightDetail,
            }[drawerTableType],
            isAdd: true,
            handleExtra: () => {
                this.setState({
                    isShowDrawer: false,
                });
                const {
                    heavyOperateStore: { fetchInit },
                } = this.props;
                fetchInit().then(() => {
                    this.refreshConfig();
                });
            },
            ...rest,
        };
        let drawerPageArr = {
            lightDetail: () => (
                <LightDetail
                    lightId={this.state.targetDetailId}
                    isDetail={true}
                    {...drawerPageProps}
                ></LightDetail>
            ),
            light: () => <LightDetail {...drawerPageProps}></LightDetail>,
        };
        let drawPageTemp =
            drawerTableType in drawerPageArr
                ? drawerPageArr[drawerTableType]()
                : "";
        return (
            <div className="heavyEditContent">
                <DrawerTable
                    switchShow={(value) => {
                        this.setState({
                            isShowDrawer: value,
                        });
                    }}
                    title={""}
                    afterVisibleChange={() => { }}
                    isShow={isShowDrawer}
                >
                    {isShowDrawer && drawPageTemp}
                </DrawerTable>
                <div className="topWrapper">
                    <div className="title">
                        {title || intlData.heavyPage_detailTitle}
                    </div>
                    {isJustShow && (
                        <Button
                            className="detailEdit"
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                this.props.history.push(getPath("heavyEdit", {
                                    search: `?heavyId=${this.heavyId}`,
                                }));
                            }}
                        >
                            {intlData["heavyPage_edit"]}
                        </Button>
                    )}
                    <Form ref={this.formRef} layout="vertical">
                        <CommonFormTable
                            isJustShow={isJustShow}
                            form={this.formRef.current}
                            dataSource={formItemArr}
                        />
                    </Form>
                </div>
                <CommonWrapper title={intlData["heavyPage_nodeSetting"]}>
                    <Row>
                        <Col span={5}>
                            <SliderMenu
                                handleSwitchClickEx={this.handleSwitchClick}
                                openKeys={openKeys}
                                isJustShow={isJustShow}
                                handleItAdd={this.handleItAdd}
                                handleNodeAdd={this.handleNodeAdd}
                                handleItDelete={this.handleItDelete}
                                handleNodeDelete={this.handleNodeDelete}
                                handleOpenChange={this.handleOpenChange}
                                handleItSwitch={this.handleItSwitch}
                                targetNodeId={targetNodeId}
                                targetShowPartAId={targetShowPartAId}
                                handleSubItemClick={this.handleSubItemClick}
                                showAByNodeList={this.showAByNodeList}
                            />
                        </Col>
                        <Col span={19}>
                            <ShowPartA
                                isSort={this.state.isSort}
                                switchDrawerShow={(value, type) => {
                                    this.handleSwitchDrawerShow(value, type);
                                }}
                                isJustShow={isJustShow}
                                handleUpdateNodeList={this.handleUpdateNodeList}
                                targetNodeId={targetNodeId}
                                targetShowPartAId={targetShowPartAId}
                                showAByNodeList={this.showAByNodeList}
                                linkSelectOptionList={linkSelectOptionList}
                            />
                        </Col>
                    </Row>
                </CommonWrapper>
                {!isJustShow && (
                    <div className="btnTable">
                        <Button
                            onClick={debounce(() => {
                                this.handleSave();
                            }, 500)}
                            style={{ marginRight: 10 }}
                            type="primary"
                        >
                            {intlData["heavyPage_save"]}
                        </Button>
                        <Button
                            onClick={() => {
                                this.props.history.goBack();
                            }}
                        >
                            {intlData["heavyPage_cancel"]}
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

export default HeavyEdit;
