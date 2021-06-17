import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { Select, Icon, Button } from "antd";
import moment from "moment";
import { PAGE_SIZE } from "COMMON/constants";
import { getPath } from "ROUTES";

export default function () {
    this.selectedRows = [];
    this.state = {
        searchPosName: "",
        pageSize: PAGE_SIZE,
        pageIndex: 1,
        columns: [],
        searchItemArr: [],
        btnInTableConfig: [],
    };
    this.refreshConfig = ()=>{
        const { intlData } = this.props;
        this.setState({
            searchItemArr:[
                {
                    dataIndex: "searchParam1",
                    width: "50%",
                    formConfig: {
                        formLayout: {
                            labelCol: { span: 8 },
                            wrapperCol: { span: 15, offset: 0 },
                            labelAlign: "left",
                        },
                        inputAttrConfig: {
                            placeholder: intlData["placeholder_input"],
                            size: "large",
                        },
                        label: (
                            <span
                                style={{
                                    lineHeight: "38px",
                                }}
                            >
                                {intlData["heavyPage_heavyName"]}
                            </span>
                        ),
                        rules: [
                            {
                                max: 30,
                                message: intlData["heavy_max_30"],
                            },
                            {
                                pattern: /^[0-9a-zA-z_-]+$/,
                                message: intlData.heavy_common,
                            },
                        ],
                    },
                },
                {
                    dataIndex: "searchParam2",
                    formConfig: {
                        type: "Select",
                        formLayout: {
                            labelCol: { span: 10 },
                            wrapperCol: { span: 14, offset: 0 },
                            labelAlign: "left",
                        },
                        optionArr: [
                            [0, "ALL"],
                            [1, "A"],
                            [2, "B"],
                        ],
                        inputAttrConfig: {
                            placeholder: intlData["placeholder_select"],
                            size: "large",
                            allowClear: true,
                        },
                        label: (
                            <span
                                style={{
                                    lineHeight: "38px",
                                }}
                            >
                                {intlData["heavyPage_applyProduct"]}
                            </span>
                        ),
                    },
                },
                {
                    dataIndex: "searchParam3",
                    formConfig: {
                        type: "Select",
                        formLayout: {
                            labelCol: { span: 4 },
                            wrapperCol: { span: 14, offset: 1 },
                            labelAlign: "left",
                        },
                        optionArr: [
                            [0, intlData.heavyPage_saved],
                            [1, intlData.heavyPage_actived],
                        ],
                        inputAttrConfig: {
                            placeholder: intlData["placeholder_select"],
                            size: "large",
                            allowClear: true,
                        },
                        label: (
                            <span
                                style={{
                                    lineHeight: "38px",
                                }}
                            >
                                {intlData.heavyPage_status}
                            </span>
                        ),
                    },
                },
            ],
            columns:[
                {
                    title: intlData["NO"],
                    dataIndex: "no",
                    key: "no",
                    width: 50,
                    fixed: "left",
                },
                {
                    title: intlData["heavyPage_heavyName"],
                    dataIndex: "heavyName",
                    key: "heavyName",
                    width: 200,
                    render: (item, record) => {
                        const { heavyId } = record;
                        return (
                            <Link
                                to={{
                                    pathname: "/pageCenter/heavyPage/detail",
                                    search: `?title=${intlData["heavyPage_detailTitle"]}&heavyId=${heavyId}`,
                                }}
                            >
                                {item}
                            </Link>
                        );
                    },
                    fixed: "left",
                },
    
                {
                    title: intlData["heavyPage_applyProduct"],
                    dataIndex: "baseSelect",
                    key: "baseSelect",
                    width: 150,
                    render: (item) => {
                        return {
                            0: "ALL",
                            1: "A",
                            2: "B",
                        }[item];
                    },
                },
                {
                    title: intlData["heavyPage_status"],
                    dataIndex: "status",
                    width: 100,
                    key: "status",
                    render: (item) => {
                        return item
                            ? intlData["heavyPage_actived"]
                            : intlData["heavyPage_saved"];
                    },
                },
                {
                    title: intlData["heavyPage_comNo"],
                    dataIndex: "computedNo",
                    key: "computedNo",
                    width: 100,
                },
                {
                    title: intlData["comment"],
                    dataIndex: "comment",
                    key: "comment",
                    width: 200,
                },
                {
                    title: intlData["heavyPage_effectDateRange"],
                    key: "Effect Date Range",
                    width: 200,
                    render: (item, record) => {
                        const { effectStartDate, effectEndDate } = record;
                        return `${effectStartDate
                            ? moment(effectStartDate).format("YYYY-MM-DD")
                            : ""
                            }~${effectEndDate
                                ? moment(effectEndDate).format("YYYY-MM-DD")
                                : ""
                            }`;
                    },
                },
                {
                    title: intlData["action"],
                    key: "action",
                    fixed: "right",
                    render: (item, record, rowIndex) => {
                        const { lightId, heavyId, status } = record;
                        return (
                            <span>
                                <Link
                                    to={getPath("heavyDetail",{
                                        search: `?title=${intlData["heavyPage_detailTitle"]}&heavyId=${heavyId}`,
                                    })}
                                >
                                    <Icon
                                        style={{
                                            fontSize: 15,
                                            color: "#1890FF",
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }}
                                        type="edit"
                                    />
                                </Link>
                                <Icon
                                    style={{
                                        fontSize: 15,
                                        color: "#1890FF",
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                    onClick={() => {
                                        this.handlDelete([heavyId]);
                                    }}
                                    type="delete"
                                />
                                <Icon
                                    style={{
                                        fontSize: 15,
                                        color: "#1890FF",
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                    onClick={() => {
                                        this.handleExchange({
                                            option: -1,
                                            rowIndex,
                                            data: item,
                                        });
                                    }}
                                    type="arrow-up"
                                />
                                <Icon
                                    style={{
                                        fontSize: 15,
                                        color: "#1890FF",
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                    onClick={() => {
                                        this.handleExchange({
                                            option: 1,
                                            data: item,
                                            rowIndex,
                                        });
                                    }}
                                    type="arrow-down"
                                />
                                <Button
                                    onClick={() => {
                                        this.handleSwitchStatus({
                                            heavyId: heavyId,
                                            status: status ? 0 : 1,
                                        });
                                    }}
                                    type={!status ? `primary` : ""}
                                >
                                    {!status
                                        ? intlData["heavyPage_active"]
                                        : intlData["heavyPage_inactive"]}
                                </Button>
                            </span>
                        );
                    },
                },
            ],
            btnInTableConfig: [
                {
                    label: intlData["add"],
                    icon: "plus",
                    handleClick: this.handleTableAddBtnClick,
                    type: "primary",
                },
                {
                    label: intlData["delete"],
                    icon: "delete",
                    handleClick: this.handleTableDeleteBtnClick,
                },
            ],
        })
    }
}
