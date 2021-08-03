import React from "react";
import OperateSearchSelectsSelect from "../cutomLinkSelect";
import { CommonSearchSelect } from "COMMON/components/";
import "../../index.scss";
import "./index.scss";
import { SwapRightOutlined } from '@ant-design/icons';
import { Form, Input, Switch, Row, Col, InputNumber } from "antd";

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

                    render: ({ inputConfig, setFieldsValue, record }) => {
                        return (
                            <Switch
                                onChange={(e) => {
                                    var event = new CustomEvent(
                                        "reRender",
                                        {
                                            detail: {
                                                allow: e,
                                            },
                                        }
                                    );
                                    document.dispatchEvent(event);
                                }}
                                {...inputConfig}
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
                    isCustomFormItem: true,
                    render: ({ record, getFieldValue }) => {
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
                            <OperateSearchSelectsSelect
                                exclude={exclude}
                                disable={!allowCodeShare}
                                useFlagInitValue={useFlagInitValue}
                                searchSelectInitValue={
                                    searchSelectInitValue
                                }
                                dataSource={searchSelectData}
                            />
                        );
                    },
                },
            },
            // {
            //     title: intlData.heavyPage_associationSelect,
            //     dataIndex: "selectProperty",
            //     key: "selectProperty",
            //     editable: true,
            //     width: "120px",
            //     formConfig: {
            //         isCustomFormContent: true,
            //         render: ({ getFieldDecorator, record }) => {
            //             const { selectProperty } = record;
            //             return (
            //                 <div>
            //                     <CommonSearchSelect
            //                         dataIndex={"selectProperty"}
            //                         initValue={selectProperty || "ALL"}
            //                         getFieldDecorator={getFieldDecorator}
            //                         dataSource={searchSelectData}
            //                     />
            //                 </div>
            //             );
            //         },
            //         inputConfig: {
            //             style: {
            //                 width: "50px",
            //             },
            //         },
            //     },
            // },
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
                        record = {},
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
                                        <Form.Item name={"testNoStart"} rules={[
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
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    let temp = parseInt(value);
                                                    if (
                                                        value &&
                                                        value * 1 >
                                                        getFieldValue(
                                                            "testNoEnd"
                                                        ) *
                                                        1
                                                    ) {
                                                        return Promise.reject(new Error("不可为零！"));
                                                    } else {
                                                        return Promise.resolve();
                                                    }

                                                },
                                            })
                                        ]} normalize={(value) => {
                                            if (
                                                value &&
                                                !isNaN(value * 1)
                                            ) {
                                                return value * 1;
                                            }
                                            return value;
                                        }} initialValue={testNoStart || 1} style={{ margin: 0 }}>
                                            <Input
                                                maxLength={4}
                                                className="testRangeInputItem"
                                            ></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={2}>
                                        <SwapRightOutlined />
                                    </Col>
                                    <Col span={7}>
                                        <Form.Item rules={[
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
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    let temp = parseInt(value);
                                                    if (
                                                        value &&
                                                        value * 1 >
                                                        getFieldValue(
                                                            "testNoEnd"
                                                        ) *
                                                        1
                                                    ) {
                                                        return Promise.reject(new Error("不可为零！"));
                                                    } else {
                                                        return Promise.resolve();
                                                    }

                                                },
                                            })
                                        ]} normalize={(value) => {
                                            if (
                                                value &&
                                                !isNaN(value * 1)
                                            ) {
                                                return value * 1;
                                            }
                                            return value;
                                        }} initialValue={testNoEnd || 9999} name={"testNoEnd"} style={{ margin: 0 }}>
                                            <Input
                                                maxLength={4}
                                                className="testRangeInputItem"
                                            ></Input>
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
