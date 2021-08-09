import React from "react";
import CommonFormTable from "@COMMON/components/formTable";
import { hasErrors } from "@COMMON/utils";
import { Form, Row, Col, Button } from "antd";
import { inject } from "mobx-react";

type CommonSearchTablePropsT = {
  [key: string]: any;
};

const CommonSearchTable: React.FC<CommonSearchTablePropsT> = (props) => {
  const [form] = Form.useForm();
  let handleSubmit: React.MouseEventHandler<HTMLElement> = (e) => {
    const { handleSearch = () => {} } = props;
    e.preventDefault();
    form
      .validateFields()
      .then((values) => {
        for (let key in values) {
          if (!values[key] && values[key] !== 0) values[key] = undefined;
        }
        handleSearch(values);
      })
      .catch((errorInfo) => {});
  };
  const {
    global: { locale },
    formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      labelAlign: "left",
    },
    dataSource,
    style,
  } = props;
  const { getFieldsError } = form;
  let spanConfig = [12, 10];
  if (dataSource.length > 1) {
    spanConfig = [21, 2];
  }
  return (
    <Form form={form} layout={"horizontal"}>
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
              onClick={handleSubmit}
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
              type="primary"
            >
              {locale == "zh" ? "查询" : "Search"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default inject("global")(CommonSearchTable);
