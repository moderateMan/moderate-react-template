import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CheckOutlined } from '@ant-design/icons';
import { Menu, Button } from "antd";
import { toJS } from "mobx";

let CARD = "CARD";
const style = {
    border: "1px dashed gray",
    padding: "0.5rem 1rem",
    marginBottom: ".5rem",
    backgroundColor: "white",
    cursor: "move",
    height: 40,
    display: "flex",
    alignItems: "center",
};
export default ({
    it,
    key,
    isJustShow,
    itIndex,
    nodeIndex,
    intlData,
    id,
    text,
    index,
    moveCard,
    handleSwitchClick,
    handleItSwitch,
}) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        drop(item, monitor) {
            if (!ref.current) {
                return;
            }
            handleItSwitch(
                {
                    nodeId: item.data.nodeId,
                    showAId: item.index,
                    itemData: item.data,
                },
                it
            );
        },
    });
    const [{ isDragging }, drag] = useDrag({
        item: { type: CARD, id, index: itIndex, data: toJS(it) },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drop(drag(ref));
    return (
        <div
            ref={ref}
            style={{ ...style, opacity }}
            data-handler-id={handlerId}
        >
            <div key={`${nodeIndex}-${itIndex}`}>
                <span style={{ marginLeft: 30 }}>
                    {intlData.heavyPage_node + `${itIndex + 1}`}
                </span>
                <span
                    className="itemSwap"
                    onClick={(e) => {
                        handleSwitchClick();
                    }}
                >
                    <CheckOutlined
                        style={{
                            marginLeft: 50,
                        }} />
                </span>
            </div>
        </div>
    );
};
