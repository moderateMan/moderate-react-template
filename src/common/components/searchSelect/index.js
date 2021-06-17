import React, { Fragment } from "react";
import { Select } from "antd";
const { Option } = Select;

class SearchSelect extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        data: [],
        tempdata: "",
    };

    handleSearch = (value) => {
        const {
            dataSource = [],
            isLocation,
            isHasAll,
            requestSearchData,
        } = this.props;
        if (value) {
            let dataTemp;
            if (requestSearchData) {
                requestSearchData({
                    locationName: value
                }).then((data) => {
                    dataTemp = data.locationList;
                    isHasAll &&
                        dataTemp.push(
                            isLocation ? "ALL" : { name: "ALL", value: "ALL" }
                        );
                    this.setState({ data: dataTemp, tempdata: value });
                });
            } else {
                dataTemp = dataSource.filter((item, index) => {
                    let targetValue = isLocation ? item : item.name;
                    return (
                        targetValue?.toLowerCase().indexOf(value.toLowerCase()) >
                        -1
                    );
                });
                isHasAll &&
                    dataTemp.push(
                        isLocation ? "ALL" : { name: "ALL", value: "ALL" }
                    );
                this.setState({ data: dataTemp, tempdata: value });
            }
        } else {
            this.setState({ data: [], tempdata: "" });
        }
    };

    handleChange = (value) => {
        const { handleChange } = this.props;
        this.setState({ tempdata: value });
        handleChange && handleChange(value);
    };

    render() {
        const { tempdata } = this.state;
        const {
            getFieldDecorator,
            initValue,
            dataIndex,
            disabled = false,
            isLocation,
            rules = {},
            other = {},
            setFieldsValue,
            isHasAll,
            isSearch,
            getFieldValue,
        } = this.props;
        const options = this.state.data.map((d) => {
            let value = isLocation ? d : d.name;
            return (
                <Option value={value} key={value}>
                    {value}
                </Option>
            );
        });
        let domProps = getFieldDecorator ? {} : { value: initValue || "ALL" };
        let dom = (
            <Select
                disabled={disabled}
                showSearch
                placeholder={this.props.placeholder}
                style={{ width: "100px" }}
                defaultActiveFirstOption={false}
                showArrow={false}
                onBlur={(e) => {
                    setFieldsValue &&
                        !isSearch &&
                        setFieldsValue({
                            [dataIndex]: tempdata,
                        });
                }}
                onSearch={this.handleSearch}
                onSelect={this.handleChange}
                notFoundContent={null}
                {...other}
                {...domProps}
            >
                {options}
            </Select>
        );
        return (
            <Fragment>
                {getFieldDecorator
                    ? getFieldDecorator(dataIndex, {
                        initialValue: isHasAll ? "ALL" : initValue,
                        rules,
                    })(dom)
                    : dom}
            </Fragment>
        );
    }
}

export default SearchSelect;
