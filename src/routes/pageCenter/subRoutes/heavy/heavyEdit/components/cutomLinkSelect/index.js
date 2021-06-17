import React from "react";
import { Select, Input } from "antd";
import "./index.scss";

import { CommonSearchSelect } from "COMMON/components/";
const InputGroup = Input.Group;
const { Option } = Select;

export default (props) => {
    const {
        dataSource,
        handleChange,
        getFieldDecorator,
        useFlagInitValue,
        searchSelectInitValue = "ALL",
        disable,
        exclude,
    } = props;
    let handleUseSelectChange = (value) => {
        updateData(value, searchSelectInitValue);
    };
    let handleSearchSelectChange = (value) => {
        updateData(useFlagInitValue, value);
    };
    let updateData = (useFlagInitValueT, searchSelectInitValueT) => {
        if (useFlagInitValueT) {
            handleChange &&
                handleChange({
                    operateSearchSelects: searchSelectInitValueT,
                    notOperateSearchSelects: null,
                });
        } else {
            handleChange &&
                handleChange({
                    notOperateSearchSelects: searchSelectInitValueT,
                    operateSearchSelects: null,
                });
        }
    };
    let selectPart1 = getFieldDecorator ? (
        exclude ? (
            <Select
                disabled={disable}
                onSelect={handleUseSelectChange}
                className="customInputItemSelect"
            >
                <Option value={1}>USE</Option>
            </Select>
        ) : (
            <Select
                disabled={disable}
                onSelect={handleUseSelectChange}
                className="customInputItemSelect"
            >
                <Option value={1}>USE</Option>
                <Option value={0}>NOT</Option>
            </Select>
        )
    ) : (
        <Select
            disabled={disable}
            onSelect={handleUseSelectChange}
            className="customInputItemSelect"
            value={useFlagInitValue ? 1 : 0}
        >
            <Option value={1}>USE</Option>
            <Option value={0}>NOT</Option>
        </Select>
    );

    return (
        <InputGroup className="cutomLinkSelect" compact>
            {getFieldDecorator
                ? getFieldDecorator("useFlag", {
                    initialValue: useFlagInitValue ? 1 : 0,
                })(selectPart1)
                : selectPart1}
            <CommonSearchSelect
                disabled={disable}
                initValue={searchSelectInitValue}
                getFieldDecorator={getFieldDecorator}
                handleChange={handleSearchSelectChange}
                dataSource={dataSource}
                dataIndex={"opSearchSelect"}
            />
        </InputGroup>
    );
};
