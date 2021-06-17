import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Prompt, Link } from 'react-router-dom';
import { Form, Icon, Button, Modal, message } from "antd";
import { objectExistValue, getUrlParam } from "COMMON/utils";
import {CommonWrapper,CommonCustomTable,CommonFormTable} from "COMMON/components";
import injectInternational from "COMMON/hocs/intlHoc";
import debounce from "lodash/debounce";
import setConfig from "./config";
import { toJS } from "mobx";
import { getPath } from 'ROUTES';
import "./index.scss";

//该页面有三个状态
let PAGE_STATUS = {
    ADD: 1,
    DETAIL: 2,
    EDIT: 3
}

@injectInternational("light")
@inject("lightOperateStore", "global")
@observer
class TempEdit extends Component {
    constructor(props) {
        super(props);
        setConfig.call(this);
        const {
            location: { pathname = "", search },
            isDetail,
            title,
        } = this.props;
        /* 通过url传入参数获得title信息 */
        this.title = title || getUrlParam(decodeURIComponent(search), "title");
        /* 通过url地址判断当前是："新建","详情","编辑" */
        for (let key in PAGE_STATUS) {
            if (pathname.includes(key.toLocaleLowerCase())) {
                this._status = PAGE_STATUS[key]
            }
        }
        if (isDetail) {
            this._status = PAGE_STATUS.DETAIL;
        }
        this.isDetail = this._status === PAGE_STATUS.DETAIL;
        this.id = getUrlParam(search, "id");
    }

    handleDelete = (value) => {
        const {
            lightOperateStore: { lightItemArr, changeParams },
        } = this.props;
        let temp = lightItemArr.filter((item) => {
            if (Array.isArray(value)) {
                return !value.includes(item.posItemId);
            } else if (typeof value === "object") {
                return item.posItemId != value.posItemId;
            } else {
                return item.posItemId != value;
            }
        });
        changeParams({ lightItemArr: temp });
    };

    componentDidMount() {
        const {
            lightOperateStore: {
                fetchInitEx,
                fetchTestDataList,
                fetchLightDetail,
                initStore
            },
        } = this.props;
        initStore();
        if (this.isEdit) {
            fetchInitEx({
                lightId: this.id,
            })
                .then(() => {
                    this.refreshConfig();
                })
                .finally(() => {

                });
        } else if (this._status === PAGE_STATUS.ADD) {
            fetchTestDataList().then(() => {
                this.refreshConfig();
            });
        } else {
            fetchLightDetail({
                id: this.id,
            }).then(() => {
                this.refreshConfig();
            });
        }

    }

    save = () => {
        const {
            form: { validateFields },
            lightOperateStore: {
                fetchLightAdd,
                fetchLightUpdate,
                lightItemArr,
                isNewAddFlag,

            },
            history,
            handleExtra,
            intlData,
        } = this.props;
        const { editingKey } = this.state
        if (editingKey) {
            return message.warning(intlData["light_editting"]);
        }
        let targetHandleSaveApi;
        //通过url地址判断当前是修改还是新增
        targetHandleSaveApi = this.isEdit ? fetchLightUpdate : fetchLightAdd;
        validateFields((error, data) => {
            if (!error && objectExistValue(data)) {
                if (
                    !lightItemArr.length ||
                    (isNewAddFlag && lightItemArr.length == 1)
                ) {
                    message.warning({
                        content: intlData["light_addOne"],
                    });
                    return;
                }
                targetHandleSaveApi({
                    lightId: this.isEdit ? this.lightId : "",
                    lightName: data.lightName,
                    lightItems: lightItemArr,
                    comment: data.comment,
                }).then(() => {
                    message.success({
                        content: intlData["light_addSave"],
                    });
                    if (handleExtra) {
                        handleExtra();
                    } else {
                        this.setState(
                            {
                                isOk: true,
                            },
                            () => {
                                history.push(getPath("lightHome"));
                            }
                        );
                    }
                });
            }
        });
    };

    // 修改store中的editPosItemKey
    handleEdit = (params) => {
        const { editingKey } = params;
        this.setState({
            editingKey
        })
    };

    handleCreate = () => {
        let values = { exclude: false };
        const {
            lightOperateStore: { changeParams, lightItemArr },
        } = this.props;
        values.posItemId = Date.now();
        values.key = values.posItemId;
        this.setState({
            editingKey: values.key
        })
        changeParams({
            lightItemArr: [...lightItemArr, values],
        });
    };

    handleSave = ({ data }) => {
        const {
            lightOperateStore: { changeParams },
        } = this.props;
        changeParams({
            lightItemArr: [...data],
        });
    };

    handleDeleteBtnClick = () => {
        const {
            lightOperateStore: { isNewAddFlag },
            intlData
        } = this.props;
        const { editingKey } = this.state;
        if (editingKey) {
            return message.warning(intlData["light_editting"]);
        } else if (isNewAddFlag) {
            message.warning("新添加的条目未保存！");
        } else if (this.selectedRows.length === 0) {
            message.warning(intlData["light_deleteData"]);
        } else {
            Modal.confirm({
                icon: <Icon type="info-circle" />,
                title: intlData["light_deleteOne"],
                content: intlData["light_irreversible"],
                okText: intlData["light_Yes"],
                cancelText: intlData["light_No"],
                onOk: () => {
                    this.handleDelete(this.selectedRows);
                },
            });
        }
    };
    componentWillUnmount() {
        //由于该页面有三个状态
        //也就是说路由变化，实际上都是要使用该组件的
        //连带的问题就很恶心，所有三个态最关键的就是彼此公用的东西再用完的时候清理一下
        //按道理讲确实开始和结尾做都行，但是有动画这个因素在，它的卸载实际上是被延迟了
        //权益的办法就是在开始的时候初始化一下仓库
    }
    handleTableSelect = ({ selectedRows }) => {
        this.selectedRows = selectedRows.map((item) => {
            return item.posItemId;
        });
    };
    handleTableEvent = ({ type, params }) => {
        let eventConfig = {
            tableSelect: this.handleTableSelect,
        };
        eventConfig[type](params);
    };
    calcWeight = (data) => {
        const { lightType, baseSelect, exclude } = data;
        let weight = 0;
        weight += 5 * (!baseSelect ? 8 : 1);
        weight +=
            {
                [0]: 1,
                [1]: 2,
                [2]: 3,
                [3]: 4,
                [4]: 48,
            }[lightType] || 0;
        weight = weight * (exclude ? 1 : 10);
        return weight;
    };
    isPrompt() {
        if (!this.state.isOk&&this._status === PAGE_STATUS.ADD) {
            return Object.entries(this.props.form.getFieldsValue()).some((item) => {
                return item[1];
            })
        } else {
            return false
        }
    }
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
            lightOperateStore,
            handleExtra,
            intlData,
        } = this.props;
       
        const { lightItemArr, isNewAddFlag } = lightOperateStore;
        const { formItemArr, columns, editingKey } = this.state;
        return (
            <div className="posEditContent">
                <Prompt
                    when={this.isPrompt()}
                    message={(location) =>
                        "当前正在编辑，你确定离开这个页面么？"
                    }
                />
                <div className="topWrapper">
                    <div className="title">{this.title}</div>
                    {this._status === PAGE_STATUS.DETAIL && <Link
                        to={getPath("lightEdit ", {
                            search: `?title=${intlData["posPage.posEditTitle"]}&id=${this.id}`,
                        })}
                    >
                        <Button
                            className="savaBtn"
                            type="primary"
                            icon="edit"
                            onClick={() => {
                                this.save();
                            }}
                        >
                            {intlData["posPage.edit"]}
                        </Button>
                    </Link>}
                    <Form layout="vertical">
                        <CommonFormTable isJustShow={this.isDetail} form={form} dataSource={formItemArr} />
                    </Form>
                </div>
                <CommonWrapper title={intlData["light_itemListTitle"]}>
                    <CommonCustomTable
                        transformNewRowData={(data) => {
                            data.weight = this.calcWeight(data);
                            return data;
                        }}
                        isJustShow={this.isDetail}
                        isNewAddFlag={isNewAddFlag}
                        pageStore={lightOperateStore}
                        handleEvent={this.handleTableEvent}
                        handleCreate={this.handleCreate}
                        handleEdit={this.handleEdit}
                        handleSave={this.handleSave}
                        handleTableSelect={this.handleTableSelect}
                        handleDelete={this.handleDelete}
                        handleDeleteBtnClick={this.handleDeleteBtnClick}
                        data={toJS(lightItemArr)}
                        columns={columns}
                        editingKey={editingKey}
                        other={{
                            scroll: { x: 1200 },
                        }}
                    />
                </CommonWrapper>
                <div className="btnTable">
                    <Button
                        onClick={debounce(this.save)}
                        style={{ marginRight: 10 }}
                        type="primary"
                    >
                        {intlData["light_save"]}
                    </Button>
                    <Button
                        onClick={() => {
                            if (handleExtra) {
                                handleExtra();
                            } else {
                                this.props.history.goBack();
                            }
                        }}
                    >
                        {intlData["light_cancel"]}
                    </Button>
                </div>
            </div >
        );
    }
}

export default Form.create()(TempEdit);
