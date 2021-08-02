import React, { useEffect, useState } from "react";
import { uuid } from "COMMON/utils";
import TopFormPart from "../topFormPart";
import ShowPartB from "../showPartB";
import ShowPartC from "../showPartC";
import { showPartBItem, showPartCItem } from "COMMON/shapes";
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from "antd";
import injectInternational from "COMMON/hocs/intlHoc";

const { confirm } = Modal;

const showPartA = injectInternational("heavy")((props) => {
    const {
        isSort,
        isJustShow,
        handleUpdateNodeList,
        showAByNodeList = [],
        targetNodeId,
        targetShowPartAId,
        linkSelectOptionList,
        switchDrawerShow,
        intlData,
    } = props;
    const [conByPosList, setConByPosList] = useState([]);
    const [segByPosList, setSegByPosList] = useState([]);
    let temp = showAByNodeList;
    let targetshowAArr = temp[targetNodeId][targetShowPartAId];
    const { topFormPart = 3 } = targetshowAArr || {};
    function filterItemByPos(arr = []) {
        let temp = [];
        arr.forEach((item, index) => {
            !(item.position in temp) && (temp[item.position] = []);
            if (!item.key) item.key = uuid();
            temp[item.position].push(item);
        });
        return temp;
    }
    useEffect(() => {
        //创建-showPartBList，showPartCList
        const { showPartBList = [], showPartCList = [] } =
            targetshowAArr || {};
        setConByPosList(filterItemByPos(showPartBList));
        setSegByPosList(filterItemByPos(showPartCList));
    }, [
        showAByNodeList,
        segByPosList.length,
        conByPosList.length,
        targetNodeId,
        targetShowPartAId,
    ]);
    //获得指定数据更新后的数据
    let getNewList = ({ pos, payload, list }) => {
        list[pos] = payload;
        let newList = [];
        list.forEach((item) => {
            if (item) {
                newList = [...newList, ...item];
            }
        });
        return newList;
    };
    //向父组件传递更新的数据
    let updateData = ({ propName, pos, payload, list }) => {
        let newList = getNewList({
            pos,
            payload,
            list,
        });
        handleUpdateNodeList({
            ...targetshowAArr,
            [propName]: newList,
        });
    };
    let updateDataEx = (arr = []) => {
        let temp = {};
        arr.forEach((item) => {
            const { propName, pos, payload, list } = item;
            let newList = getNewList({
                pos,
                payload,
                list,
            });
            temp[propName] = newList;
        });

        handleUpdateNodeList({
            ...targetshowAArr,
            ...temp,
        });
    };
    let handleShowPartBAdd = () => {
        if (conByPosList.length === 3) {
            return message.warning(`${intlData.heavyPage_maxCount} 2`);
        }
        let newPosition = conByPosList.length;
        let newPosition2 = segByPosList.length;
        let newShowPartBList = getNewList({
            payload: [{ ...showPartBItem(), position: newPosition }],
            pos: newPosition,
            list: conByPosList,
        });
        let newShowPartCList = getNewList({
            payload: [{ ...showPartCItem(), position: newPosition2 }],
            pos: newPosition2,
            list: segByPosList,
        });
        handleUpdateNodeList({
            ...targetshowAArr,
            showPartCList: newShowPartCList,
            showPartBList: newShowPartBList,
        });
    };
    let handleUpdateData = ({ showPartCData, showPartBData }) => {
        showPartCData &&
            updateData({
                propName: "showPartCList",
                ...showPartCData,
                list: segByPosList,
            });
        showPartBData &&
            updateData({
                propName: "showPartBList",
                ...showPartBData,
                list: conByPosList,
            });
    };
    let handleConDelete = ({ pos }) => {
        confirm({
            title: intlData.modalDeleteTitle,
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: () => {
                let temp = [
                    {
                        propName: "showPartBList",
                        pos,
                        payload: undefined,
                        list: conByPosList,
                    },
                ];
                if (pos > 1) {
                    temp.push({
                        propName: "showPartCList",
                        pos: pos + 1,
                        payload: undefined,
                        list: segByPosList,
                    });
                }
                updateDataEx(temp);
            },
            onCancel() { },
        });
    };
    let processSearchSelectData = (data) => {
        return data.map((item, index) => {
            const { familyName, selectProperty, searchSelectFamilyId } = item;
            let familyNameValue = familyName ? familyName : "";
            item.name = familyName || selectProperty;
            item.value = item.name;
            return item;
        });
    };
    return (
        <div className="showPartB">
            {isSort&&<div style={{ position: "absolute",  inset: 9, backgroundColor: "rgb(0,0,0,0.2)", zIndex: 10 }}></div>}
            <TopFormPart
                isJustShow={isJustShow}
                handleFcChange={(value) => {
                    handleUpdateNodeList({
                        ...targetshowAArr,
                        topFormPart: value,
                    });
                }}
                handleDataChange={(params) => {
                    handleUpdateNodeList({
                        ...targetshowAArr,
                        ...params,
                    });
                }}
                searchSelectData={processSearchSelectData([
                    ...linkSelectOptionList,
                ])}
                topFormPart={topFormPart}
                targetshowAArr={targetshowAArr}
            />
            {topFormPart === 3 &&
                conByPosList.map((item, index) => {
                    let isEnableDeleteBtn = false;
                    if (index != 1 && index === conByPosList.length - 1) {
                        isEnableDeleteBtn = true;
                    }
                    return (
                        <ShowPartB
                            switchDrawerShow={switchDrawerShow}
                            isEnableDeleteBtn={isEnableDeleteBtn}
                            isJustShow={isJustShow}
                            position={index}
                            handleUpdateData={handleUpdateData}
                            data={item}
                            key={index}
                            handleConDelete={handleConDelete}
                        >
                            {segByPosList.map((item, segIndex) => {
                                if (item) {
                                    if (segIndex == index) {
                                        return (
                                            <ShowPartC
                                                searchSelectData={processSearchSelectData(
                                                    [
                                                        ...linkSelectOptionList,
                                                    ]
                                                )}
                                                isJustShow={isJustShow}
                                                handleUpdateData={
                                                    handleUpdateData
                                                }
                                                position={segIndex}
                                                data={item}
                                                bordered={false}
                                                key={segIndex}
                                            ></ShowPartC>
                                        );
                                    }
                                }
                            })}
                        </ShowPartB>
                    );
                })}
            {!isJustShow && topFormPart === 3 && (
                <Button
                    onClick={handleShowPartBAdd}
                    type="dashed"
                    icon={<PlusOutlined />}
                    className="addShowPartBBtn"
                >
                    {`${intlData.add} ${intlData.heavyPage_showPartB}`}
                </Button>
            )}
        </div>
    );
});

export default showPartA;
