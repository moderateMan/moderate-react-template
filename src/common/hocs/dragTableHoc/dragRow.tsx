import React from "react";
import "./index.css";
import { DragSource, DropTarget } from "react-dnd";
let dragingIndex = -1;
type PropsPT = {
    [key:string]:any
}
class BodyRow extends React.Component<PropsPT> {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: "move" };

        let { className } = restProps;
        if (isOver) {
            if (restProps.index > dragingIndex) {
                className += " drop-over-downward";
            }
            if (restProps.index < dragingIndex) {
                className += " drop-over-upward";
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr {...restProps} className={className} style={style} />
            )
        );
    }
}

const rowSource = {
    beginDrag(props:any) {
        dragingIndex = props.index;
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props:any, monitor:any) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.moveRow(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    },
};

export default DropTarget("row", rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource("row", rowSource, (connect) => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow)
);
