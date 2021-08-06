import React, { Fragment } from "react";
import CommonFormItem from "COMMON/components/formItem";
import PropTypes from "prop-types";
import { Col, Row } from "antd";

const contextHoc = (WrappedComponent) => {
    return class extends React.Component {
        static propTypes = {
            form: PropTypes.object, //当前form对象
            dataSource: PropTypes.array, //table-dataSorce数据源
        };

        static defaultProps = {
            form: {},
            dataSource: [],
        };
        constructor(props) {
            super(props);
            this.rowConfig = {};
        }
        count(data) {
            this.rowConfig = {};
            for (let item of data) {
                const { rowIndex = 0 } = item;
                !(rowIndex in this.rowConfig) &&
                    (this.rowConfig[rowIndex] = []);
                this.rowConfig[rowIndex].push(item);
            }
        }
        getTable = () => {
            const { form, dataSource, ...restProps } = this.props;
            let rowArr = [];
            this.count(dataSource);
            for (let key in this.rowConfig) {
                let colArr = this.rowConfig[key];
                let span =
                    colArr.length === 1 ? 24 : parseInt(24 / colArr.length);
                rowArr.push(
                    <Row key={key} gutter={[100, 50]}>
                        {colArr.map((item, index) => {
                            return (
                                <Col span={span} key={index}>
                                    <CommonFormItem
                                        form={form}
                                        span={span}
                                        data={item}
                                        key={index}
                                        {...restProps}
                                    ></CommonFormItem>
                                </Col>
                            );
                        })}
                    </Row>
                );
            }
            return rowArr;
        };
        render() {
            return <Fragment>{this.getTable()}</Fragment>;
        }
    };
};

export default contextHoc;
