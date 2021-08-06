import React from "react";
import "./index.css";
import { DndProvider, DragSource, DropTarget } from "react-dnd";
import PropTypes from "prop-types";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import DragableBodyRow from "./dragRow";

function dragTableHoc(WrappedComponent) {
    return class extends React.Component {
        static propTypes = {
            handleUpdateData: PropTypes.func, //回调-更新table数据源-如果不传，数据源更新默认被该高级组件state托管
        };
        constructor(props) {
            super(props);
            this.state = { data: [] };
            this.isLoadData = false; //标记是否传入外部数据源并存储在本组件state
        }

        components = {
            body: {
                row: DragableBodyRow,
            },
        };

        moveRow = (dragIndex, hoverIndex) => {
            const { handleUpdateData = this.setState.bind(this) } = this.props;
            const { data } = this.state;
            const dragRow = data[dragIndex];
            handleUpdateData(
                update(this.state, {
                    data: {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, dragRow],
                        ],
                    },
                })
            );
        };
        componentDidUpdate() {
            const { data, handleUpdateData } = this.props;
            //如果没有提供数据源的更新回调(意味着不被外部数据源控制显示)，并且第一次外部传入非空值就进行设置
            //主要意图-由于数据异步请求，无法在高级组件创建初期获得，需要监听符合情况时进行设置
            if (!handleUpdateData && !this.isLoadData && data.length) {
                this.isLoadData = true;
                this.setState({
                    data,
                });
            }
        }

        render() {
            const { data, handleUpdateData } = this.props;
            const props = Object.assign({}, this.props, {
                data: handleUpdateData ? data : this.state.data,
                other: {
                    components: this.components,
                    onRow: (record, index) => {
                        return {
                            index,
                            moveRow: this.moveRow,
                        };
                    },
                },
            });
            return (
                <DndProvider backend={HTML5Backend}>
                    <WrappedComponent {...props} />
                </DndProvider>
            );
        }
    };
}

export default dragTableHoc;
