import React, { Fragment } from "react";
import {
    Form,
    Input,
    Checkbox,
    Upload,
    Icon,
    Button,
    Select,
    DatePicker,
    Switch,
    InputNumber,
} from "antd";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
let Option = Select.Option;
let getSelect = (params) => {
    const { inputAttrConfig = {}, optionArr } = params;
    const {
        style = {
            width: "100%",
        },
        ...rest
    } = inputAttrConfig;
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
                inputAttrConfig = {},
                optionArr = [],
                render,
                formLayout = {},
                isDebug,
                isCustomFormContent,//自定义formitem所包裹的内容
                isCustomFormItem,//彻底自定义，无需对其进行额外饿formItem包裹
                ...rest
            } = formConfig;
            if (type === "Select") {
                inputAttrConfig.style = { width: "100%", ...inputAttrConfig.style }
            }
            let itemConfig = {
                Checkbox: <Checkbox {...inputAttrConfig}>{label2}</Checkbox>,
                Switch: <Switch {...inputAttrConfig}></Switch>,
                Upload: (
                    <Upload showUploadList={false} {...config}>
                        <Button>
                            <Icon type="upload" /> Click to Upload
                        </Button>
                    </Upload>
                ),
                TextArea: <TextArea {...inputAttrConfig} />,
                Select: () => {
                    return getSelect({ inputAttrConfig, optionArr });
                },
                RangePicker: <RangePicker {...inputAttrConfig} />,
                InputNumber: (
                    <InputNumber
                        style={{ width: "80%" }}
                        {...inputAttrConfig}
                    />
                ),
                default: <Input {...inputAttrConfig} />,
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
                if (isCustomFormContent) {
                    formContent = itemTemp
                } else {
                    formContent = getFieldDecorator(dataIndex, {
                        ...rest,
                    })(itemTemp)
                }
            }

            return (
                <Form.Item {...formLayout} style={{ width: "100%", margin: 0 }} label={typeof label === 'function' ? label() : label}>
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
