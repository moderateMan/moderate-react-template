import React from "react";
import "../../index.scss";
import { Switch, Input, Form } from "antd";
import CustomSelect from "../customSelect";
import { Fragment } from "react";

export const updateConfig = (params) => {
    const {
        intlData,
    } = params;
    let tableConfig = {
        columns: [
            {
                title: intlData.heavyPage_exclude,
                dataIndex: "exclude",
                key: "exclude",
                editable: true,
                width: "70px",
                render: (value) => {
                    return <Switch checked={value}></Switch>;
                },
                inputType: "Checkbox",
                formConfig: {
                    render: (params) => {
                        const { inputAttrConfig } = params;
                        return <Switch {...inputAttrConfig}></Switch>;
                    },
                    valuePropName: "checked",
                    initialValue: false,
                    rules: [],
                    type: "Checkbox",
                    inputAttrConfig: {},
                },
            },
            {
                title: intlData.heavyPage_maxConnectTime,
                dataIndex: "maxConxTime",
                key: "maxConxTime",
                editable: true,
                formConfig: {
                    isCustomFormContent: true,
                    render: ({ getFieldValue, getFieldDecorator, record }) => {
                        let initValue = record["maxConxTime"];
                        return (
                            <Fragment>
                                {getFieldDecorator("maxConxTime", {
                                    initialValue: initValue,
                                    normalize: (value) => {
                                        if (value && !isNaN(value * 1)) {
                                            return value * 1;
                                        }
                                        return value;
                                    },
                                    rules: [
                                        {
                                            pattern: /^[0-9]+$/,
                                            message: intlData.rule_number,
                                        },
                                        {
                                            message:
                                                intlData.heavyPage_heavy_maxConx,
                                            validator: (
                                                rule,
                                                value,
                                                callback
                                            ) => {
                                                let temp = parseInt(value);
                                                if (
                                                    !isNaN(temp) &&
                                                    temp <
                                                    parseInt(
                                                        getFieldValue("mct")
                                                    )
                                                ) {
                                                    callback(true);
                                                } else {
                                                    callback();
                                                }
                                            },
                                        },
                                    ],
                                })(
                                    <Input
                                        maxLength={8}
                                        style={{ width: "100%" }}
                                        placeholder={intlData.placeholder_input}
                                    ></Input>
                                )}
                            </Fragment>
                        );
                    },
                },
            },
            {
                title: intlData.heavyPage_minConnectTime,
                dataIndex: "mct",
                key: "mct",
                editable: true,
                formConfig: {
                    type: "Input",
                    inputAttrConfig: {
                        placeholder: intlData.placeholder_input,
                        maxLength: 8,
                        style: {
                            width: "100%",
                        },
                    },

                    rules: [
                        {
                            pattern: /^[0-9]+$/,
                            message: intlData.rule_number,
                        },
                    ],
                },
            },
        ],
        other: {
            style: {
                background: "#fafafa",
            },
            bordered: false,
        },
    };
    return { tableConfig };
};
