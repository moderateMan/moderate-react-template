import React, { Fragment } from "react";
import CommonFormItem from "@COMMON/components/formItem";
import "./index.scss";
import { Col, Row } from "antd";

type CommonFormTablePT = {
    [key:string]:any
}
class CommonFormTable extends React.Component<CommonFormTablePT> {
    rowConfig:any;
    constructor(props:CommonFormTablePT) {
        super(props);
        this.rowConfig = {};
    }
    count(data:any) {
        this.rowConfig = {};
        for (let item of data) {
            const { rowIndex = 0 } = item;
            !(rowIndex in this.rowConfig) && (this.rowConfig[rowIndex] = []);
            this.rowConfig[rowIndex].push(item);
        }
    }
    getFormTable = () => {
        const {
            form,
            dataSource,
            isJustShow,
            style = { marginBottom: 30 },
            ...restProps
        } = this.props;
        let rowArr = [];
        this.count(dataSource);
        let showTemp:any = [];
        for (let key in this.rowConfig) {
            let colArr = this.rowConfig[key];
            let span = colArr.length === 1 ? 24 : parseInt(String(24 / colArr.length));
            rowArr.push(
                <Row
                    className="formTable"
                    style={style}
                    key={key}
                    gutter={[30, 0]}
                >
                    {colArr.map((item:any, index:number) => {
                        if (Array.isArray(item.formConfig.initialValue)) {
                            item.formConfig.initialValue.forEach((item2:any) => {
                                showTemp.push(item2.format("YYYY-MM-DD"));
                            });
                        }

                        return (
                            <Col span={item.span || span} key={index}>
                                {isJustShow ? (
                                    <div>
                                        <div className="formTable_title">
                                            {item.formConfig.label}
                                        </div>
                                        <div className="formTable_info">
                                            {Array.isArray(
                                                item.formConfig.initialValue
                                            )
                                                ? showTemp.join("~")
                                                : item.formConfig.initialValue}
                                        </div>
                                    </div>
                                ) : (
                                    <CommonFormItem
                                        form={form}
                                        data={item}
                                        key={index}
                                        {...restProps}
                                    ></CommonFormItem>
                                )}
                            </Col>
                        );
                    })}
                </Row>
            );
        }
        return rowArr;
    };
    render() {
        return <Fragment>{this.getFormTable()}</Fragment>;
    }
}
export default CommonFormTable;
