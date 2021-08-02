import React from "react";
import OperateSearchSelectsSelect from "../cutomLinkSelect";
import SearchSelect from "../searchSelect";
import "../../index.scss";
import "./index.scss";
import { SwapRightOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Switch, Row, Col, InputNumber } from "antd";

export const tableConfig = (params = {}) => {
    const { searchSelectData = [], isJustShow, intlData } = params;
    return {
        columns: [
            {
                title: intlData.heavyPage_linkSwitch,
                dataIndex: "allowCodeShare",
                key: "allowCodeShare",
                editable: true,
                width: '80px',
                render: (value) => {
                    return <Switch checked={value}></Switch>;
                },
                inputType: "Checkbox",
                formConfig: {
                    render: ({ inputAttrConfig, setFieldsValue, record }) => {
                        return (
                            <Switch
                                onChange={(e) => {
                                    var event = new CustomEvent(
                                        "cutomLinkSelect_allow",
                                        {
                                            detail: {
                                                allow: e,
                                            },
                                        }
                                    );
                                    document.dispatchEvent(event);
                                }}
                                {...inputAttrConfig}
                            ></Switch>
                        );
                    },
                    valuePropName: "checked",
                    initialValue: false,
                    type: "Checkbox",
                },
            },
            {
                title: intlData.heavyPage_compoundSelect,
                dataIndex: "operateSearchSelectsAll",
                key: "operateSearchSelectsAll",
                editable: true,
                width: 200,
                render: (text, record, index) => {
                    const { operateSearchSelects, notOperateSearchSelects, allowCodeShare } = record;
                    let useFlagInitValue = "use",
                        searchSelectInitValue = "";
                    if (operateSearchSelects) {
                        useFlagInitValue = "use";
                        searchSelectInitValue = operateSearchSelects;
                    } else if (notOperateSearchSelects) {
                        useFlagInitValue = "not";
                        searchSelectInitValue = notOperateSearchSelects;
                    }
                    return (
                        allowCodeShare ? searchSelectInitValue &&
                            `${useFlagInitValue}-${searchSelectInitValue}` : ""
                    );
                },
                formConfig: {
                    isCustomFormContent: true,
                    render: ({ getFieldDecorator, record, getFieldValue }) => {
                        const { operateSearchSelects, notOperateSearchSelects } = record;
                        let useFlagInitValue = true,
                            searchSelectInitValue;
                        if (operateSearchSelects) {
                            useFlagInitValue = true;
                            searchSelectInitValue = operateSearchSelects;
                        } else if (notOperateSearchSelects) {
                            useFlagInitValue = false;
                            searchSelectInitValue = notOperateSearchSelects;
                        }
                        let allowCodeShare = getFieldValue("allowCodeShare");
                        let exclude = getFieldValue("exclude");
                        return (
                            <div>
                                <OperateSearchSelectsSelect
                                    exclude={exclude}
                                    disable={!allowCodeShare}
                                    useFlagInitValue={useFlagInitValue}
                                    searchSelectInitValue={
                                        searchSelectInitValue
                                    }
                                    getFieldDecorator={getFieldDecorator}
                                    dataSource={searchSelectData}
                                />
                            </div>
                        );
                    },
                },
            },
            {
                title: intlData.heavyPage_associationSelect,
                dataIndex: "selectProperty",
                key: "selectProperty",
                editable: true,
                width: "120px",
                formConfig: {
                    isCustomFormContent: true,
                    render: ({ getFieldDecorator, record }) => {
                        const { selectProperty } = record;
                        return (
                            <div>
                                <SearchSelect
                                    dataIndex={"selectProperty"}
                                    initValue={selectProperty || "ALL"}
                                    getFieldDecorator={getFieldDecorator}
                                    dataSource={searchSelectData}
                                />
                            </div>
                        );
                    },
                    inputAttrConfig: {
                        style: {
                            width: "50px",
                        },
                    },
                },
            },
            {
                title: intlData.heavyPage_range,
                dataIndex: "testRange",
                key: "testRange",
                editable: true,
                width: "180px",
                formConfig: {
                    isDebug: true,
                    isCustomFormItem: true,
                    render: ({
                        getFieldDecorator,
                        record = {},
                        getFieldValue,
                    }) => {
                        const {
                            testNoEnd = 9999,
                            testNoStart = 1,
                        } = record;
                        return (
                            <div>
                                <Row style={{
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <Col span={9} offset={3}>
                                        <Form.Item style={{ margin: 0 }}>
                                            {getFieldDecorator(
                                                "testNoStart",
                                                {
                                                    initialValue:
                                                        testNoStart || 1,
                                                    normalize: (value) => {
                                                        if (
                                                            value &&
                                                            !isNaN(value * 1)
                                                        ) {
                                                            return value * 1;
                                                        }
                                                        return value;
                                                    },
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message:
                                                                intlData.heavyPage_startNo,
                                                        },
                                                        {
                                                            pattern: /^[0-9]+$/,
                                                            message:
                                                                intlData.rule_number,
                                                        },
                                                        {
                                                            message:
                                                                intlData.heavyPage_heavy_zeroWarn,
                                                            validator: (
                                                                rule,
                                                                value,
                                                                callback
                                                            ) => {
                                                                if (
                                                                    value == 0
                                                                ) {
                                                                    callback(
                                                                        "不可为零！"
                                                                    );
                                                                } else {
                                                                    callback();
                                                                }
                                                            },
                                                        },
                                                        {
                                                            message:
                                                                intlData.heavyPage_heavy_maxWarn,
                                                            validator: (
                                                                rule,
                                                                value,
                                                                callback
                                                            ) => {
                                                                if (
                                                                    value &&
                                                                    value * 1 >
                                                                    getFieldValue(
                                                                        "testNoEnd"
                                                                    ) *
                                                                    1
                                                                ) {
                                                                    callback(
                                                                        "不可为零！"
                                                                    );
                                                                } else {
                                                                    callback();
                                                                }
                                                            },
                                                        },
                                                    ],
                                                }
                                            )(
                                                <Input
                                                    maxLength={4}
                                                    className="testRangeInputItem"
                                                ></Input>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <SwapRightOutlined />
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item style={{ margin: 0 }}>
                                            {getFieldDecorator("testNoEnd", {
                                                initialValue:
                                                    testNoEnd || 9999,
                                                normalize: (value) => {
                                                    if (
                                                        value &&
                                                        !isNaN(value * 1)
                                                    ) {
                                                        return value * 1;
                                                    }
                                                    return value;
                                                },
                                                rules: [
                                                    {
                                                        required: true,
                                                        message:
                                                            intlData.heavyPage_startNo,
                                                    },
                                                    {
                                                        pattern: /^[0-9]+$/,
                                                        message:
                                                            intlData.rule_number,
                                                    },
                                                    {
                                                        message:
                                                            intlData.heavyPage_heavy_zeroWarn,
                                                        validator: (
                                                            rule,
                                                            value,
                                                            callback
                                                        ) => {
                                                            if (value == 0) {
                                                                callback(
                                                                    "不可为零！"
                                                                );
                                                            } else {
                                                                callback();
                                                            }
                                                        },
                                                    },
                                                ],
                                            })(
                                                <Input
                                                    maxLength={4}
                                                    className="testRangeInputItem"
                                                ></Input>
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        );
                    },
                },
                render: (text, record, index) => {
                    const { testNoEnd = "", testNoStart = "" } = record;
                    return `${testNoStart || 1}-${testNoEnd || 9999}`;
                },
            },
        ],
        other: {
            scroll: isJustShow ? undefined : { x: 900 },
            style: {
                background: "#fafafa",
            },
            bordered: false,
        },
    };
};
