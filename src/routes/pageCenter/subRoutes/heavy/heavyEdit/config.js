import React from "react";
import "./index.scss";
import moment from "moment";

function findNameFromOptionArr(arr, id) {
    let findTemp = arr.find((item) => {
        return item[0] == id;
    });
    return findTemp ? findTemp[1] : "";
}

export default function () {
    this.maxNodeNum = 15;
    this.state = {
        intlData: "",
        drawerTableType: "",
        isShowDrawer: false,
        isJustShow: false,
        btnInTableConfig: [],
        formItemArr: [],
        openKeys: ["0"],
        targetDetailId: "",
        isOk: false,
        isShowModal: false,
        filterModalData: "",
        modalType: "",
        switchCheckID: 0,
    };
    //刷新驱动显示上方输入条目的配置数据
    this.refreshConfig = () => {
        const {
            heavyOperateStore: {
                heavyDataPart1,
                lightOptionArr = [],
            },
            intlData,
        } = this.props;
        const {
            heavyName,
            comment,
            lightId,
            baseSelect = 0,
            effectStartDate,
            effectEndDate,
            computedNo,
        } = heavyDataPart1;

        let lightIdTemp = this.isDetail
            ? findNameFromOptionArr(lightOptionArr, lightId)
            : lightId;

        this.setState({
            //上方表单的配置项目
            formItemArr: [
                {
                    dataIndex: "heavyName",
                    formConfig: {
                        initialValue: heavyName,
                        label: intlData.heavyPage_heavyName + ":",
                        rules: [
                            {
                                required: true,
                                message:
                                    intlData.placeholder_input +
                                    intlData.heavyPage_heavyName.toLowerCase() +
                                    "!",
                            },
                            {
                                max: 30,
                                message: intlData.rule_max_30,
                            },
                            {
                                pattern: /^[0-9a-zA-z_-]+$/,
                                message: intlData.rule_common,
                            },
                        ],
                        inputConfig: {
                            placeholder: intlData.placeholder_input,
                            maxLength: 30,
                            size: "large",
                        },
                    },
                    rowIndex: 0,
                },
                {
                    dataIndex: "lightId",
                    key: "lightId",
                    formConfig: {
                        optionArr: lightOptionArr,
                        initialValue: this.isDetail ? (
                            <a
                                onClick={() => {
                                    this.handleSwitchDrawerShow(
                                        true,
                                        "lightDetail",
                                        lightId
                                    );
                                }}
                            >
                                {lightIdTemp}
                            </a>
                        ) : (
                            lightIdTemp
                        ),
                        label: intlData.heavyPage_conectLight + ":",
                        rules: [
                            {
                                required: true,
                                message:
                                    intlData.placeholder_input + "!",
                            },
                        ],
                        type: "Select",
                        inputConfig: {
                            placeholder: intlData.placeholder_select,
                            size: "large",
                            style: { width: "100%" },
                        }
                    },
                    rowIndex: 0,
                },
                {
                    dataIndex: "baseSelect",
                    key: "baseSelect",
                    formConfig: {
                        optionArr: [
                            [0, "ALL"],
                            [1, "A"],
                            [2, "B"],
                        ],
                        initialValue: this.isDetail
                            ? { 0: "ALL", 1: "A", 2: "B" }[
                            baseSelect
                            ]
                            : baseSelect,
                        label: intlData.heavyPage_applyProduct + ":",
                        rules: [
                            {
                                required: true,
                                message:
                                    intlData.placeholder_input +
                                    intlData.heavyPage_applyProduct.toLowerCase() +
                                    "!",
                            },
                        ],
                        type: "Select",
                        inputConfig: {
                            size: "large",
                        },
                    },
                    rowIndex: 1,
                },
                {
                    dataIndex: "effectDate",
                    key: "effectDate",
                    formConfig: {
                        initialValue: effectStartDate
                            ? [moment(effectStartDate), moment(effectEndDate)]
                            : [moment(), moment("2099-12-31")],
                        label: intlData.heavyPage_effectDateRange,
                        rules: [
                            {
                                required: true,
                                message:
                                    intlData.placeholder_input +
                                    intlData.heavyPage_effectDateRange.toLowerCase() +
                                    "!",
                            },
                        ],
                        type: "RangePicker",
                        inputConfig: {
                            size: "large",
                        },
                    },
                    rowIndex: 1,
                },
                {
                    dataIndex: "computedNo",
                    formConfig: {
                        type: "InputNumber",
                        initialValue: computedNo,
                        label: intlData.heavyPage_baseNo + ":",
                        rules: [
                            {
                                pattern: /^[0-9]+$/,
                                message:
                                    intlData.rule_number.toLowerCase() + "!",
                            },
                        ],
                        inputConfig: {
                            disabled: this.isEdit,
                            placeholder:
                                intlData.placeholder_input,
                            size: "large",
                            style: {
                                width: "100%",
                            },
                        },
                    },
                    rowIndex: 2,
                },
                {
                    dataIndex: "comment",
                    formConfig: {
                        initialValue: comment,
                        label: intlData.heavyPage_comment + "：",
                        rules: [],
                        type: "TextArea",
                        inputConfig: {
                            placeholder: intlData.placeholder_input,
                            autoSize: { minRows: 4 },
                            maxLength: 60,
                        },
                    },
                    rowIndex: 2,
                },
                {
                    dataIndex: "1",
                    formConfig: {
                        initialValue: "",
                        label: "",
                        rules: [],
                        type: "",
                        inputConfig: {
                            style: {
                                display: "none",
                            },
                        },
                    },
                    rowIndex: 2,
                },
            ],
        });
    };
    this.selectedRows = [];
}
