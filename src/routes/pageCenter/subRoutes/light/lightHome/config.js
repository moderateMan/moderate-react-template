import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PAGE_SIZE } from "COMMON/constants";
import { getPath } from 'ROUTES';

export default function () {
    this.selectedRows = [];
    this.state = {
        pageSize: PAGE_SIZE,
        searchLightName: "",
        pageIndex: 1,
        columns: [],
        searchItemArr: [],
        btnInTableConfig: [],
    };

    this.refreshConfig = ()=>{
        const { intlData } = this.props;
        this.setState({
            columns: [
                {
                    title: intlData["light_Id"],
                    dataIndex: "id",
                    key: "id",
                },
                {
                    title: intlData["light_lightName"],
                    dataIndex: "lightName",
                    key: "lightName",
                    render: (item, record) => {
                        const { id } = record;
                        return (
                            <Link
                                to={getPath("lightDetail", {
                                    search: `?title=${intlData["light_lightEetailTitle"]}&id=${id}`,
                                })}
                            >
                                {item}
                            </Link>
                        );
                    },
                },
                {
                    title: intlData["light_comment"],
                    dataIndex: "comment",
                    key: "comment",
                },
                {
                    title: intlData["light_action"],
                    key: "action",
                    render: (item, record) => {
                        const { id } = item;
                        return (
                            <span>
                                <Link
                                    to={getPath("lightEdit", {
                                        search: `?title=${intlData["light_lightEditTitle"]}&id=${id}`
                                    })}
                                >
                                    <EditOutlined
                                        style={{
                                            fontSize: 15,
                                            color: "#1890FF",
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }} />
                                </Link>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 15,
                                        color: "#1890FF",
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                    onClick={() => {
                                        this.handlDelete([id]);
                                    }} />
                            </span>
                        );
                    },
                },
            ],
            searchItemArr: [
                {
                    dataIndex: "searchLightName",
                    formConfig: {
                        formLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 18 },
                            labelAlign: "left",
                        },
                        inputAttrConfig: {
                            placeholder:
                                intlData["placeholder_input"],
                            size: "large",
                        },
                        label: (
                            <span
                                style={{
                                    lineHeight: "38px",
                                }}
                            >
                                {intlData["light_searchParam"]}
                            </span>
                        ),
                        rules: [
                            {
                                max: 30,
                                message: intlData["light_heavy_lightName_1"],
                            },
                            {
                                pattern: /^[0-9a-zA-z_-]+$/,
                                message: intlData["light_placeholder_lightName"],
                            },
                        ],
                    },
                },
            ],
            btnInTableConfig: [
                {
                    label: intlData["light_add"],
                    icon: "plus",
                    handleClick: this.handleTableAddBtnClick,
                    type: "primary",
                },
                {
                    label: intlData["light_delete"],
                    icon: "delete",
                    handleClick: this.handleTableDeleteBtnClick,
                },
            ],
        })
    }
}
