import React  from "react";
import { UploadOutlined } from '@ant-design/icons';
import { Form,Input, Checkbox, Upload, Button, Select, DatePicker, Switch, InputNumber } from "antd";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let Option = Select.Option;
let getSelect = (params) => {
    const { inputConfig = {}, optionArr } = params;
    const {
        style = {
            width: "100%",
        },
        ...rest
    } = inputConfig;
    return (
        <Select style={style} {...rest}>
            {optionArr &&
                optionArr.length > 0 &&
                optionArr.map((item) => {
                    return (
                        <Option value={item[0]} key={item}>
                            {item[1]}
                        </Option>
                    );
                })}
        </Select>
    );
};
function formItemHoc(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props);
        }

        proc(wrappedComponentInstance) { }

        getFromItem({
            dataIndex = "null",
            formConfig = {},
            getFieldDecorator = () => { },
            getFieldValue = () => { },
            setFieldsValue = () => { },
            config = {},
            ...restProps
        }) {
            
            const {
                label = "",
                label2,
                type,
                inputConfig = {},
                optionArr = [],
                render,
                formLayout = {},
                isDebug,
                isCustomFormContent,//自定义formitem所包裹的内容
                isCustomFormItem,//彻底自定义，无需对其进行额外饿formItem包裹
                ...rest
            } = formConfig;
            if (type === "Select") {
                inputConfig.style = { width: "100%", ...inputConfig.style }
            }
            let itemConfig = {
                Checkbox: <Checkbox {...inputConfig}>{label2}</Checkbox>,
                Switch: <Switch {...inputConfig}></Switch>,
                Upload: (
                    <Upload showUploadList={false} {...config}>
                        <Button>
                            <UploadOutlined /> Click to Upload
                        </Button>
                    </Upload>
                ),
                TextArea: <TextArea {...inputConfig} />,
                Select: () => {
                    return getSelect({ inputConfig, optionArr });
                },
                RangePicker: <RangePicker {...inputConfig} />,
                InputNumber: (
                    <InputNumber
                        style={{ width: "80%" }}
                        {...inputConfig}
                    />
                ),
                default: <Input {...inputConfig} />,
            };

            let itemTemp;
            if (render) {
                itemTemp = render({
                    ...formConfig,
                    getFieldDecorator,
                    getFieldValue,
                    setFieldsValue,
                    ...restProps,
                });
            } else {
                if (type in itemConfig) {
                    itemTemp =
                        typeof itemConfig[type] === "function"
                            ? itemConfig[type]()
                            : itemConfig[type];
                } else {
                    itemTemp = itemConfig["default"];
                }
            }
            let formContent = itemTemp
            if (isCustomFormItem) {
                return itemTemp;
            } else {
                formContent = itemTemp
            }

            return (
                <Form.Item {...rest} name={dataIndex} {...formLayout} style={{ width: "100%", margin: 0 }} label={typeof label === 'function' ? label() : label}>
                    {formContent}
                </Form.Item>
            );
        }

        render() {
            const props = Object.assign({}, this.props, {
                ref: this.proc.bind(this),
                getFromItem: this.getFromItem,
            });
            return <WrappedComponent {...props} />;
        }
    };
}

export default formItemHoc;
