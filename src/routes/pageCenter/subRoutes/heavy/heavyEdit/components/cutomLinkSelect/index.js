import React from "react";
import { CommonSearchSelect, CommonFormItem } from "COMMON/components/";
import "./index.scss";

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
    let selectPart1 = exclude ? <CommonFormItem  formConfig={{
        inputConfig:{ disabled: disable },
        type: "Select", optionArr: [[0, "NOT"]
        ]
    }}></CommonFormItem> : <CommonFormItem  formConfig={{
        type: "Select", optionArr: [[0, "NOT"], [1, "USE"]
        ],inputConfig:{ disabled: disable }
    }}></CommonFormItem>
    return (
        <div style={{ display: "flex" }}>
            {selectPart1}
            <CommonSearchSelect
                disabled={disable}
                initValue={searchSelectInitValue}
                getFieldDecorator={getFieldDecorator}
                handleChange={handleSearchSelectChange}
                dataSource={dataSource}
                dataIndex={"opSearchSelect"}
            />
        </div>
    );
};
