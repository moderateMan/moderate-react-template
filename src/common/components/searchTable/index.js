import React from "react";
import CommonFormTable from "COMMON/components/formTable";
import { hasErrors } from "COMMON/utils";
import { Form,  Row, Col, Button } from "antd";
import { inject } from "mobx-react";

@inject("global")
class CommonSearchTable extends React.Component {
    handleSubmit = (e) => {
        const { handleSearch = () => { } } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            for (let key in values) {
                if (!values[key] && values[key] !== 0) values[key] = undefined;
            }
            if (!err) {
                handleSearch(values);
            }
        });
    };
    render() {
        const {
            global: { locale },
            formLayout = {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
                labelAlign: "left",
            },
            form,
            dataSource,
            style,
        } = this.props;
        const { getFieldsError } = form;
        let spanConfig = [12, 10];
        if (dataSource.length > 1) {
            spanConfig = [21, 2];
        }

        return (
            <Form layout={"horizontal"} onSubmit={this.handleSubmit}>
                <Row style={{ marginBottom: -20 }}>
                    <Col span={spanConfig[0]}>
                        <CommonFormTable
                            style={style}
                            formLayout={formLayout}
                            form={form}
                            dataSource={dataSource}
                        />
                    </Col>
                    <Col span={spanConfig[1]} style={{ marginLeft: 20 }}>
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                disabled={hasErrors(getFieldsError())}
                                type="primary"
                                icon="search"
                            >
                                {locale == "zh" ? "查询" : "Search"}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(CommonSearchTable);
