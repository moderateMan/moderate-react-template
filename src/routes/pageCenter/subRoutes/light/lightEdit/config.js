import React, { Component } from "react";
import "./index.scss";
import { Select, Switch } from "antd";
import ComputeNum from "COMMON/components/computeNum";
let Option = Select.Option;

export default function config() {
    this.state = {
        btnInTableConfig: [],
        formItemArr: [],
        columns: [],
        isOk: false,
    };
    //刷新驱动显示上方输入条目的配置数据
    this.refreshConfig = () => {
        const { intlData } = this.props;
        const {
            lightOperateStore: {  lightName, comment },
        } = this.props;
        this.setState({
            //上方表单的配置项目
            formItemArr: [
                {
                    dataIndex: "lightName",
                    formConfig: {
                        initialValue: lightName,
                        label: intlData["light_lightName"] + ":",
                        rules: [
                            {
                                required: true,
                                message: `${intlData["light_placeholder_input"]} ${intlData["light_lightName"]}`,
                            },
                            {
                                max: 30,
                                message: intlData["light_heavy_lightName_1"],
                            },
                            {
                                pattern: /^[0-9a-zA-z_-]+$/,
                                message:
                                    intlData["light_placeholder_lightName"],
                            },
                        ],
                        inputConfig: {
                            placeholder:
                                intlData["light_placeholder_lightName"],
                            maxLength: 30,
                            size: "large",
                        },
                    },
                },
                {
                    dataIndex: "comment",
                    formConfig: {
                        initialValue: comment,
                        label: intlData["light_comment"] + "：",
                        rules: [],
                        type: "TextArea",
                        inputConfig: {
                            placeholder:
                                intlData["light_placeholder_comment"],
                            autoSize: { minRows: 4 },
                            maxLength: 60,
                        },
                    },
                },
            ],
            columns: [
                {
                    title: intlData["light_searchSelect"],
                    dataIndex: "lightType",
                    key: "lightType",
                    editable: true,
                    width: "130px",
                    formConfig: {
                        rules: [
                            {
                                required: true,
                                message: `${intlData["light_placeholder_input"]} ${intlData["light_lightType"]}`,
                            },
                        ],
                        inputConfig: {
                            placeholder: `${intlData["light_placeholder_select"]} ${intlData["light_lightType"]}`,
                            maxLength: 60,
                            style: {
                                width: "100%",
                            },
                        },
                        optionArr: [
                            [0, intlData["light_option"] + "A"],
                            [1, intlData["light_option"] + "B"],
                            [2, intlData["light_option"] + "C"],
                            [3, intlData["light_option"] + "D"],
                            [4, intlData["light_option"] + "E"],
                        ],
                        type: "Select",
                        render: ({
                            inputConfig,
                            optionArr,
                            setFieldsValue,
                        }) => {
                            return (
                                <Select
                                    {...inputConfig}
                                >
                                    {optionArr &&
                                        optionArr.length > 0 &&
                                        optionArr.map((item) => {
                                            return (
                                                <Option
                                                    value={item[0]}
                                                    key={item}
                                                >
                                                    {item[1]}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            );
                        },
                    },
                    render: (value) => {
                        return {
                            [0]: intlData["light_option"] + "A",
                            [1]: intlData["light_option"] + "B",
                            [2]: intlData["light_option"] + "C",
                            [3]: intlData["light_option"] + "D",
                            [4]: intlData["light_option"] + "E",
                        }[value];
                    },
                },
                {
                    title: intlData["light_baseSelect"],
                    dataIndex: "baseSelect",
                    key: "baseSelect",
                    editable: true,
                    width: "170px",
                    formConfig: {
                        optionArr: [
                            [0, intlData["light_option"] + "A"],
                            [1, intlData["light_option"] + "B"],
                        ],
                        inputConfig: {
                            placeholder: intlData["light_placeholder_aoa"],
                            style: {
                                width: "150px",
                            },
                            allowClear: true,
                        },
                        type: "Select",
                    },
                    render: (value) => {
                        return {
                            [0]: intlData["light_option"] + "A",
                            [1]: intlData["light_option"] + "B",
                        }[value];
                    },
                },
                {
                    title: intlData["light_exclude"],
                    dataIndex: "exclude",
                    key: "exclude",
                    editable: true,
                    width: "100px",
                    render: (value) => {
                        return <Switch checked={value}></Switch>;
                    },
                    formConfig: {
                        valuePropName: "checked",
                        initialValue: false,
                        type: "Switch",
                        inputConfig: {}
                    },
                },
                {
                    title: intlData["light_computeNum"],
                    dataIndex: "weight",
                    key: "weight",
                    editable: true,
                    width: "100px",
                    formConfig: {
                        isCustomFormItem: true,
                        render: ({ getFieldValue, setFieldsValue }) => {
                            let lightType = getFieldValue("lightType"),
                                baseSelect = getFieldValue("baseSelect"),
                                exclude = getFieldValue("exclude");
                            let values = {
                                lightType,
                                baseSelect,
                                exclude,
                            }
                            return <ComputeNum values={values} handler={this.calcWeight}></ComputeNum>;
                        },
                    },
                    render: (value, record) => {
                        value = value ? value : this.calcWeight(record)
                        return <div>{value}</div>;
                    },
                },
            ],
        });
    };

    this.selectedRows = [];
}
