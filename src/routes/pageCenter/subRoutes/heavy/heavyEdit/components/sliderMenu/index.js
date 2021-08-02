import React, { useState } from "react";
import { DeleteOutlined, DoubleRightOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { Menu } from "antd";
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
                        <PlusOutlined />
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
                                        <DoubleRightOutlined />
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
                                                <DeleteOutlined></DeleteOutlined>
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
                                            <PlusOutlined />
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
                                                    <DeleteOutlined></DeleteOutlined>
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
                                                    <SwapOutlined
                                                        style={{
                                                            transform:
                                                                "rotate(-90deg)",
                                                        }} />
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
