import React, { Component } from "react";
import { findDOMNode } from 'react-dom'
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Layout, Modal, Button, Input, Dropdown, Menu } from "antd";
import "./header.scss";
import FetchRequest from 'SRC/dataManager/netTrans/request'
import injectInternational from "COMMON/hocs/intlHoc";
import { inject, observer } from "mobx-react";
import { warningByMessage, successByMessage, exceptionByMessage } from "COMMON/utils";
import { IS_SIMPLE } from "COMMON/constants";
import Storage from "COMMON/storage";

import encrypt from "COMMON/aes/encrypt";
const Header = Layout.Header;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 18,
    },
};

@injectInternational("header")
@inject("global")
@observer
class TopHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            confirmDirty: false,
            modalVisible: false
        };
    }

    componentDidMount() {
        const {
            intlData,
            global: { changeParams },
        } = this.props;
        this.menu = () => {
            const {
                intlData,
            } = this.props;
            return <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">{intlData.header_changePassword}</Menu.Item>
                <Menu.Item key="2">{intlData.header_logOut}</Menu.Item>
            </Menu>
        }
        if (Storage.getStorage(IS_SIMPLE)) {
            changeParams({
                modalVisible: true,
                disabled: true,
                isClosable: true,
                maskClose: false,
            });
        } else {
            changeParams({
                modalVisible: false,
                disabled: false,
                isClosable: false,
                maskClose: true,
            });
        }
    }

    handleMenuClick = ({ key }) => {
        const {
            logout,
        } = this.props;
        let cbArr = {
            [1]: this.showModal,
            [2]: logout
        }
        if (key in cbArr) {
            cbArr[key]()
        }
    }

    handleLangSwitch = () => {
        
        const {
            global: { changeParams, locale },
        } = this.props;
        changeParams({
            locale: locale === "en" ? "zh" : "en"
        })
    }
    /*表单验证方法*/
    modalConfirm = () => {
        const {
            form: { validateFieldsAndScroll },
        } = this.props;
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.editPassword(values);
            }
        });
    };

    /*修改密码Ajax方法 */
    editPassword = () => {
        const {
            intlData,
            form: { getFieldsValue },
            global: { changeParams },
        } = this.props;
        const headerErrorOpen = intlData.header_errorOpen;
        const pwdChangeSuccess = intlData.header_pwdChangeSuccess;
        const pwdNot = intlData.header_pwdNot;
        const password = getFieldsValue().password;
        const data = {
            password,
        };
        let encryptData = { body: encrypt(JSON.stringify(data)) };
        if (password !== "123456") {
            FetchRequest.requestPost("/editPassword", encryptData)
                .then((res) => {
                    const { code } = res;
                    if (code === "200") {
                        successByMessage(pwdChangeSuccess);
                        Storage.removeStorage(IS_SIMPLE);
                        changeParams({ modalVisible: false });
                    }
                })
                .catch(() => {
                    exceptionByMessage(headerErrorOpen);
                });
        } else {
            warningByMessage(pwdNot);
        }
    };

    /*取消按钮方法*/
    modalCancel = () => {
        this.setState({ modalVisible: false, userId: null, })
    };

    /*modal展示方法*/
    showModal = () => {
        this.setState({
            modalVisible: true,
        })
    };

    /*确认密码blur方法*/
    handleConfirmBlur = (e) => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    /*两次密码对比方法*/
    compareToFirstPassword = (rule, value, callback) => {
        const {
            form: { getFieldValue },
            intl: { formatMessage },
        } = this.props;
        const passwordInconsistent = formatMessage({
            id: "header_passwordInconsistent",
        });
        if (value && value !== getFieldValue("password")) {
            callback(passwordInconsistent);
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {
        const {
            form: { getFieldDecorator },
            global: { disabled },
            toggle,
            collapsed,
            intlData
        } = this.props;
        const { modalVisible } = this.state;
        return (
            <Header className="header_style">
                <LegacyIcon
                    className="trigger"
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={toggle}
                />

                <div className="header_manage">
                    <Button
                        onClick={this.handleLangSwitch}
                        type="primary"
                        ghost
                        shape="round"
                    >
                        {intlData.header_intlBtn}
                    </Button>
                    <Dropdown overlay={this.menu} placement="bottomCenter">
                        <Avatar src={"https://s1.imagehub.cc/images/2021/06/14/6B547B38-C3AE-480E-B15A-42F35AE60CCF20210120-160584b5f3604ca3737.jpg"} style={{
                            float: "right",
                            marginLeft: "15px",
                            marginTop: "15px",
                            backgroundColor: '#87d068'
                        }} icon={<UserOutlined />} />
                    </Dropdown>
                    <Modal
                        visible={modalVisible}
                        title={intlData.header_setPassword}
                        onOk={this.modalConfirm}
                        okText={intlData.save}
                        onCancel={this.modalCancel}
                        cancelButtonProps={{ disabled }}
                        destroyOnClose
                    >
                        <Form {...formItemLayout}>
                            <FormItem label={intlData.header_newPassword} hasFeedback>
                                {getFieldDecorator("password", {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: intlData.header_pleaseInputNewWord,
                                        },
                                        {
                                            pattern: /(?!\d+$)(?![A-Za-z]+$)(?!\W+$)[\w\W]{8,20}$/,
                                            message: intlData.header_pwdTip,
                                        },
                                        {
                                            validator: this
                                                .validateToNextPassword,
                                        },
                                    ],
                                })(
                                    <Input.Password placeholder={intlData.header_newPassword} />
                                )}
                            </FormItem>
                            <FormItem label={intlData.header_PasswordConfirmation} hasFeedback>
                                {getFieldDecorator("confirm", {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: intlData.header_pleaseInputConfirmWord,
                                        },
                                        {
                                            pattern: /(?!\d+$)(?![A-Za-z]+$)(?!\W+$)[\w\W]{8,19}$/,
                                            message: intlData.header_pwdTip,
                                        },
                                        {
                                            validator: this
                                                .compareToFirstPassword,
                                        },
                                    ],
                                })(
                                    <Input.Password
                                        placeholder={intlData.header_pwdConfirm}
                                        onBlur={this.handleConfirmBlur}
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
            </Header>
        );
    }
}

export default Form.create()(TopHeader);
