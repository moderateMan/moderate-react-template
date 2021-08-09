import React from "react";
import "./index.scss";
import { Form, Modal } from "antd";
import CommonFormItem from "COMMON/components/formItem";

class commonModalCollection extends React.Component {
    state = {
        visible: false,
    };

    showModal = () => {
        this.setState({ visible: true });
    };

    handleCancel = () => {
        const {
            handleCancel,
            form: { resetFields },
        } = this.props;
        handleCancel && handleCancel();
        this.setState({ visible: false });
        resetFields();
    };

    handleSubmit = (e) => {
        const { extraJude } = this.props;
        e.preventDefault();
        const {
            handleCreate = () => { },
            form: { validateFields, resetFields },
        } = this.props;
        if (extraJude && !extraJude()) return;
        validateFields((err, values) => {
            if (err) {
                return;
            }
            handleCreate(values, () => {
                resetFields();
                this.setState({ visible: false });
            });
        });
    };
    render() {
        const { title, form, render, config = [], width = 600, okText, cancelText } = this.props;
        return (
            <div>
                <span onClick={this.showModal}>{render()}</span>
                <Modal
                    visible={this.state.visible}
                    title={title}
                    okText={okText}
                    cancelText={cancelText}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    width={width}
                >
                    {config.map((item, index) => {
                        return (
                            <CommonFormItem
                                form={form}
                                data={item}
                                key={index}
                            ></CommonFormItem>
                        );
                    })}
                </Modal>
            </div>
        );
    }
}

export default (commonModalCollection);
