import React, { Fragment } from "react";
import { Select } from "antd";
const { Option } = Select;

class SearchSelect extends React.Component {
    state = {
        data: [],
        value: undefined,
    };

    handleSearch = (value) => {
        const { dataSource = [] } = this.props;
        if (value) {
            let dataTemp = dataSource.filter((item, index) => {
                const { name } = item;
                return name.toLowerCase().indexOf(value.toLowerCase()) > -1;
            });
            dataTemp.push({ name: "ALL", value: "ALL" });
            this.setState({ data: dataTemp });
        } else {
            this.setState({ data: [] });
        }
    };

    handleChange = (value) => {
        const { handleChange } = this.props;
        this.setState({ value });
        handleChange && handleChange(value);
    };

    render() {
        const options = this.state.data.map((d) => (
            <Option value={d.value} key={d.name}>
                {d.name}
            </Option>
        ));
        const {
            getFieldDecorator,
            initValue,
            dataIndex,
            disabled = false,
        } = this.props;
        let domProps = getFieldDecorator ? {} : { value: initValue || "ALL" };
        let dom = (
            <Select
                disabled={disabled}
                showSearch
                placeholder={this.props.placeholder}
                style={{ width: "100px" }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={this.handleSearch}
                onSelect={this.handleChange}
                notFoundContent={null}
                {...domProps}
            >
                {options}
            </Select>
        );
        return (
            <Fragment>
                {getFieldDecorator
                    ? getFieldDecorator(dataIndex, {
                          initialValue: initValue,
                      })(dom)
                    : dom}
            </Fragment>
        );
    }
}

export default SearchSelect;
