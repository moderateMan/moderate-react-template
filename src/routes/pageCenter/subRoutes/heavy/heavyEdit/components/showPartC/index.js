import React, { useState } from "react";
import CustomTable from "COMMON/components/customTable";
import { inject } from "mobx-react";
import { Collapse, message } from "antd";
import { showPartCItem } from "COMMON/shapes";
import { tableConfig } from "./config";
import injectInternational from "COMMON/hocs/intlHoc";

const { Panel } = Collapse;

const ShowPartC = injectInternational("heavy")((props) => {
    const [isNewAddFlag, setIsNewAddFlag] = useState(false);
    const [editingKey, setEditIngKey] = useState("");
    const {
        isJustShow,
        data,
        id,
        position = "1",
        children,
        handleUpdateData,
        handleAdd,
        searchSelectData,
        intlData,
        ...rest
    } = props;
    let handleCreate = () => {
        let temp = [...data];
        let newCon = { ...showPartCItem(), position };
        temp.push(newCon);
        setEditIngKey(newCon.key);
        handleUpdateData({
            showPartCData: {
                pos: position,
                payload: temp,
            },
        });
    };
    let transformNewRowData = (rowData) => {
        rowData.allowCodeShare = rowData.allowCodeShare ? 1 : 0;
        const { useFlag, opSearchSelect } = rowData;
        if (opSearchSelect) {
            if (useFlag) {
                rowData.operateSearchSelects = opSearchSelect;
                rowData.notOperateSearchSelects = "";
            } else {
                rowData.notOperateSearchSelects = opSearchSelect;
                rowData.operateSearchSelects = "";
            }
        }
        return rowData;
    };
    return (
        <div>
            <Collapse {...rest}>
                <Panel
                    header={`${intlData.heavyPage_showPartC} ${position}`}
                    key="1"
                >
                    <CustomTable
                        isJustShow={isJustShow}
                        isNewAddFlag={isNewAddFlag}
                        editingKey={editingKey}
                        handleCreate={handleCreate}
                        data={data}
                        transformNewRowData={transformNewRowData}
                        handleSave={({ data }) => {
                            if (data.length) {
                                handleUpdateData({
                                    showPartCData: {
                                        pos: position,
                                        payload: data,
                                    },
                                });
                            } else {
                                message.warning(intlData.warn_leastOne);
                            }
                        }}
                        handleEdit={({ editingKey = "" }) => {
                            setEditIngKey(editingKey);
                        }}
                        handleSwitchNewAddFlag={(value) => {
                            setIsNewAddFlag(value);
                        }}
                        {...tableConfig({
                            searchSelectData,
                            isJustShow,
                            intlData,
                        })}
                    />
                </Panel>
            </Collapse>
        </div>
    );
});

export default inject("lightOperateStore")(ShowPartC);
