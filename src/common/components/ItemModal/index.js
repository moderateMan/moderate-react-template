import React from "react";
import "./index.scss";
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Input, Select, Tag, Checkbox } from "antd";
import { initial } from "lodash";

class commonItemModal extends React.Component {
    state = {
        visible: false,
        // isRed: true,
        // data: {},
        optionString: [],
        // itemName: "", //Sort Item Name 需要回传
        optionArr: [], //添加的value 需要回传
        optionParams: [], // tag标签显示
        // optionName: "", //tag显示内容
        // optionArrTemp: [],
    };

    componentDidMount() {
        const {
            itemData: { sortString = "" },
        } = this.props;
        let { optionTagArr } = this.props;
        let newArr =
            sortString !== ""
                ? sortString.split("-").map((item) => {
                      return {
                          optionString: item,
                          optionName: optionTagArr[item],
                      };
                  })
                : "";
        this.setState({
            optionParams: newArr,
        });
    }
    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    //获取tag事件
    getTag = (item = {}, index) => {
        const { optionName = "", optionString = "" } = item;
        return (
            <Tag
                key={index}
                closable
                onClose={() => {
                    this.onCloseTag(item);
                }}
            >
                {typeof item === "object" ? "" : item}
            </Tag>
        );
    };

    // 添加按钮
    handleItemBtnClick = () => {
        const {
            // optionName,
            optionArr,
            optionParams,
            // optionArr=[]
        } = this.state;
        const {
            form: { getFieldValue },
        } = this.props;
        const { type } = this.props;
        if (type === "Filter") {
            this.handleFilterBtnClick();
        } else {
            let SortBy = getFieldValue("SortBy");
            const { optionALLArr } = this.props;
            optionALLArr.map((item) => {
                if (SortBy === item[1]) {
                    this.setState({
                        optionArr: [...optionArr, item[0]],
                        optionParams: [...optionParams, SortBy],
                    });
                }
            });
        }
    };
    handleFilterBtnClick = () => {
        const { optionParams, optionString } = this.state;
        const {
            form: { getFieldValue },
        } = this.props;
        let filterBy = getFieldValue("filterBy");
        let operator = getFieldValue("operator");
        let number = getFieldValue("number");
        let pv = getFieldValue("pv");
        let str =
            pv === "percent"
                ? filterBy + " " + operator + " " + number + " " + pv
                : filterBy + " " + operator + " " + number;

        this.setState({
            optionParams: [...optionParams, str],
            optionString: [
                ...optionString,
                {
                    filterBy: filterBy,
                    operator: operator,
                    number: number,
                    pv: pv,
                },
            ],
        });
    };
    //Tag关闭
    onCloseTag = (removedTag) => {
        const { optionParams } = this.state;
        // let { optionArr = [] } = this.state;
        // optionArr.splice(
        //     optionArr.findIndex((item) => item === value),
        //     1
        // );
        const tags = optionParams.filter((tag) => tag !== removedTag);
        this.setState({
            optionParams: [...tags, this.getTag()],
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            handleCreate = () => {},
            form: { validateFields, resetFields },
        } = this.props;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            resetFields();
            this.setState({ visible: false });
            handleCreate(values, this.state);
        });
    };
    render() {
        const {
            propConfigArr,
            itemData,
            isShowBtn,
            title,
            form: { getFieldDecorator },
            render,
            handlChangeCheck,
        } = this.props;
        const { optionParams, optionString } = this.state;
        return (
            <div>
                <span onClick={this.showModal}>{render()}</span>
                <Modal
                    visible={this.state.visible}
                    title={title}
                    okText="保存"
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                >
                    <Form>
                        {propConfigArr.map((item, index) => {
                            let itemTemp = { ...item };
                            if (itemTemp.type === "Input") {
                                return (
                                    <Form.Item
                                        style={{ width: itemTemp.styleWidth }}
                                        label={itemTemp.label}
                                    >
                                        {getFieldDecorator(itemTemp.propName, {
                                            rules: itemTemp.rules,
                                            initialValue:
                                                itemData[itemTemp.propName],
                                        })(
                                            <Input
                                                {...itemTemp.inputAttrConfig}
                                            />
                                        )}
                                    </Form.Item>
                                );
                            } else if (itemTemp.type === "Select") {
                                return (
                                    <Form.Item
                                        style={{ width: itemTemp.styleWidth }}
                                        label={itemTemp.label}
                                    >
                                        {getFieldDecorator(itemTemp.propName, {
                                            rules: itemTemp.rules,
                                            initialValue:
                                                itemData[itemTemp.propName],
                                        })(
                                            // onChange={this.handleSelectChange} >
                                            <Select
                                                {...itemTemp.inputAttrConfig}
                                            >
                                                {itemTemp.optionArr &&
                                                    itemTemp.optionArr.length >
                                                        0 &&
                                                    itemTemp.optionArr.map(
                                                        (item) => {
                                                            if (
                                                                item[0] !==
                                                                optionString
                                                            ) {
                                                                return (
                                                                    <Select.Option
                                                                        value={
                                                                            item[1]
                                                                        }
                                                                        key={
                                                                            item[0]
                                                                        }
                                                                    >
                                                                        {
                                                                            item[1]
                                                                        }
                                                                    </Select.Option>
                                                                );
                                                            }
                                                        }
                                                    )}
                                            </Select>
                                        )}
                                    </Form.Item>
                                );
                            } else if (itemTemp.type === "Checkbox") {
                                return (
                                    <Form.Item
                                        style={{ width: itemTemp.styleWidth }}
                                        label={itemTemp.label}
                                    >
                                        {getFieldDecorator(itemTemp.label, {
                                            rules: itemTemp.rules,
                                            initialValue:
                                                itemData[itemTemp.propName],
                                        })(
                                            <Checkbox
                                                {...itemTemp.inputAttrConfig}
                                                onChange={handlChangeCheck}
                                            ></Checkbox>
                                        )}
                                    </Form.Item>
                                );
                            }
                        })}
                    </Form>
                    <div style={isShowBtn}>
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={this.handleItemBtnClick}
                        >
                            添加
                        </Button>

                        {optionParams && (
                            <div className="optionTag">
                                {Array.isArray(optionParams) &&
                                    optionParams.map((item, index) => {
                                        return this.getTag(item, index);
                                    })}
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Form.create()(commonItemModal);
