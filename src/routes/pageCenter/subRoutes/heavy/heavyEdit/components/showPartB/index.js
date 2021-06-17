import React, { Fragment, useEffect, useState } from "react";
import "./index.scss";
import CustomTable from "COMMON/components/customTable";

import useStores from "COMMON/hooks/useStores";
import { showPartBItem } from "COMMON/shapes";
import { message, Icon, Popover } from "antd";
import { updateConfig } from "./config";
import injectInternational from "COMMON/hocs/intlHoc";

const showPartB = injectInternational("heavy")((props) => {
    const [config, setConfig] = useState({});
    const [isNewAddFlag, setIsNewAddFlag] = useState(false);
    const [editingKey, setEditIngKey] = useState("");
    const {
        isJustShow,
        data = [],
        id,
        position,
        children,
        handleUpdateData,
        handleConDelete,
        isEnableDeleteBtn,
        switchDrawerShow,
        intlData,
        ...rest
    } = props;
    const { heavyOperateStore} = useStores();

    useEffect(() => {
        setConfig(
            updateConfig({
                intlData,
                pageStore: heavyOperateStore,
                switchDrawerShow,
            })
        );
    }, [intlData]);

    const { tableConfig = {} } = config;

    let handleCreate = () => {
        let temp = [...data];
        let newCon = { ...showPartBItem(), position };
        temp.push(newCon);
        setEditIngKey(newCon.key);
        handleUpdateData({
            showPartBData: {
                pos: position,
                payload: temp,
            },
        });
    };
    let transformNewRowData = (rowData) => {
        return rowData;
    };
    return (
        <div className="showPartB">
            <div className="showPartBTile">
                {`${intlData.heavyPage_showPartB} ${position}`}
                {!isJustShow && (
                    <Fragment>
                        <Icon
                            className={
                                isEnableDeleteBtn
                                    ? "titleBtn"
                                    : "titleBtnDisable"
                            }
                            type="delete"
                            onClick={() => {
                                if (!isEnableDeleteBtn) return;
                                handleConDelete({ pos: position });
                            }}
                        ></Icon>
                        <Popover
                            content={
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Icon
                                        style={{
                                            color: " #FAAD14",
                                            marginRight: 5,
                                        }}
                                        type="info-circle"
                                        theme="filled"
                                    />
                                    {intlData.heavyPage_warn_deleteCon}
                                </div>
                            }
                        >
                            <Icon className="titleBtn" type="question-circle" />
                        </Popover>
                    </Fragment>
                )}
            </div>
            <CustomTable
                isHideAddNewRow={false}
                isShowDeleteBtn={false}
                isJustShow={isJustShow}
                isNewAddFlag={isNewAddFlag}
                pageStore={heavyOperateStore}
                data={data}
                handleCreate={handleCreate}
                transformNewRowData={transformNewRowData}
                handleSave={({ data }) => {
                    if (data.length) {
                        handleUpdateData({
                            showPartBData: {
                                pos: position,
                                payload: data,
                            },
                        });
                    } else {
                        message.warning(intlData.heavyPage_leastOne);
                    }
                }}
                handleEdit={({ editingKey = "" }) => {
                    setEditIngKey(editingKey);
                }}
                handleSwitchNewAddFlag={(value) => {
                    setIsNewAddFlag(value);
                }}
                editingKey={editingKey}
                {...tableConfig}
            />
            {children}
        </div>
    );
});

export default showPartB;
