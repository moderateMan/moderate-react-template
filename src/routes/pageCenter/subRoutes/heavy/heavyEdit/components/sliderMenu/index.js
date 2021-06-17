import React, { useState } from "react";
import { Menu, Icon } from "antd";
import useStores from "COMMON/hooks/useStores";
import injectInternational from "COMMON/hocs/intlHoc";
import ShowPartAItem from "./showPartAItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.scss";

const { SubMenu } = Menu;
const SliderMenu = injectInternational("heavy")((props) => {
    const {
        handleSwitchClickEx,
        isJustShow,
        showAByNodeList,
        handleSubItemClick,
        handleNodeAdd,
        handleItAdd,
        handleItDelete,
        handleNodeDelete,
        handleOpenChange,
        handleItSwitch,
        openKeys,
        intlData,
    } = props;
    const [isSort, setIsSort] = useState(false);
    const { heavyOperateStore } = useStores();
    const { targetNodeId, targetShowPartAId } = heavyOperateStore;
    let openKeysTemp = openKeys || [`${targetNodeId}`];
    const handleClick = (e) => {
        console.log("click ", e);
    };
    const handleSwitchClick = () => {
        handleSwitchClickEx(!isSort)
        setIsSort(!isSort);
    };
    return (
        <div className="sliderMenu">
            <div className="btn">
                {!isJustShow && (
                    <a onClick={handleNodeAdd}>
                        <Icon type="plus" />
                        <span className="btnLabel">
                            {intlData.heavyPage_add2 + intlData.heavyPage_node}
                        </span>
                    </a>
                )}
            </div>
            <DndProvider backend={HTML5Backend}>
                <Menu
                    selectedKeys={[`${targetNodeId}-${targetShowPartAId}`]}
                    openKeys={openKeysTemp}
                    className="menuItem"
                    mode="inline"
                    onClick={({ item, key, keyPath, domEvent }) => {
                        debugger
                        handleSubItemClick({
                            nodeId: keyPath[keyPath.length - 1] * 1,
                            showPartAId: key.split("-")[1] * 1,
                        });
                    }}
                    onOpenChange={handleOpenChange}
                >
                    {showAByNodeList.map((itArr, nodeIndex) => {
                        return (
                            <SubMenu
                                key={nodeIndex}
                                title={
                                    <span>
                                        <Icon type="double-right" />
                                        <span>
                                            {intlData.heavyPage_node}{" "}
                                            {nodeIndex + 1}
                                        </span>
                                        {!isJustShow && (
                                            <span
                                                className="itemClose"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNodeDelete({
                                                        nodeId: nodeIndex,
                                                    });
                                                }}
                                            >
                                                <Icon type="delete"></Icon>
                                            </span>
                                        )}
                                    </span>
                                }
                            >
                                {!isJustShow && (
                                    <div className="btn">
                                        <a
                                            onClick={() => {
                                                handleItAdd(nodeIndex + 1);
                                            }}
                                        >
                                            <Icon type="plus" />
                                            <span className="btnLabel">
                                                {intlData.heavyPage_add2 +
                                                    intlData.heavyPage_node}
                                            </span>
                                        </a>
                                    </div>
                                )}
                                {/* if you won`t use DndProvider to wraper your component that has processed by useDrop or useDrap,you will never get the context........so try it! */}
                                {itArr.map((it, itIndex) => {
                                    let params = {
                                        it,
                                        itIndex,
                                        intlData,
                                        isJustShow,
                                        handleItDelete,
                                        nodeIndex,
                                    };
                                    return isSort ? (
                                        <ShowPartAItem
                                            {...params}
                                            handleItSwitch={(p1,p2)=>{
                                                handleItSwitch(p1,p2)
                                            }}
                                            handleSwitchClick={
                                                handleSwitchClick
                                            }
                                            key={itIndex}
                                        ></ShowPartAItem>
                                    ) : (
                                        <Menu.Item
                                            data={it}
                                            key={`${nodeIndex}-${itIndex}`}
                                        >
                                            {intlData.heavyPage_node}{" "}
                                            {itIndex + 1}{" "}
                                            {!isJustShow && (
                                                <span
                                                    className="itemClose"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleItDelete({
                                                            nodeId:
                                                                nodeIndex + 1,
                                                            showAId: itIndex,
                                                        });
                                                    }}
                                                >
                                                    <Icon type="delete"></Icon>
                                                </span>
                                            )}
                                            {!isJustShow && (
                                                <span
                                                    className="itemSwap"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSwitchClick();
                                                    }}
                                                >
                                                    <Icon
                                                        style={{
                                                            transform:
                                                                "rotate(-90deg)",
                                                        }}
                                                        type="swap"
                                                    />
                                                </span>
                                            )}
                                        </Menu.Item>
                                    );
                                })}
                            </SubMenu>
                        );
                    })}
                </Menu>
            </DndProvider>
        </div>
    );
});

export default SliderMenu;
