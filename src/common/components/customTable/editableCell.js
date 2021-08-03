import React from "react";
import CommonFormItem from "COMMON/components/formItem";
import "./index.scss";

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    formConfig,
    form,
    ...restProps
}) => {
    let formConfigTemp = { ...formConfig };
    formConfigTemp.record = record;
    return (
        <td {...restProps}>
            {editing ? (
                <CommonFormItem dataIndex={dataIndex} {...form} formConfig={formConfigTemp}></CommonFormItem>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;
