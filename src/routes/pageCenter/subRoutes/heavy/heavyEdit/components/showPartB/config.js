import React from "react";
import "../../index.scss";
import { Switch, Input } from "antd";
import CustomSelect from "../customSelect";
import { Fragment } from "react";

export const updateConfig = (params) => {
    const {
        intlData,
    } = params;
    let tableConfig = {
        columns: [
            {
                title: intlData.heavyPage_maxConnectTime,
                dataIndex: "maxConxTime",
                key: "maxConxTime",
                editable: true,
                formConfig: {
                    rules: [
                        {
                            pattern: /^[0-9]+$/,
                            message: intlData.rule_number,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                let temp = parseInt(value);
                                if (
                                    !isNaN(temp) &&
                                    temp >
                                    parseInt(
                                        getFieldValue("mct")
                                    )
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(intlData.heavyPage_heavy_maxConx));
                            },
                        }),
                    ],
                    normalize: (value) => {
                        if (value && !isNaN(value * 1)) {
                            return value * 1;
                        }
                        return value;
                    },
                    inputConfig: {
                        maxLength: 8,
                        style: {
                            width: "100%"
                        },
                        placeholder: intlData.placeholder_input,
                    }
                },
            },
            {
                title: intlData.heavyPage_minConnectTime,
                dataIndex: "mct",
                key: "mct",
                editable: true,
                formConfig: {
                    type: "Input",
                    inputConfig: {
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
