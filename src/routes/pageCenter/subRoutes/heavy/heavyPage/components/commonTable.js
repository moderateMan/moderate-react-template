import React from "react";
import { Table } from "antd";
class CommonTable extends React.Component {
    render() {
        const {
            columns,
            data = [],
            pagination,
            handleTableSelect = () => {},
        } = this.props;
        return (
            <Table
                pagination={pagination}
                rowSelection={{
                    onSelect: (record, selected, selectedRows, nativeEvent) => {
                        handleTableSelect({
                            record,
                            selected,
                            selectedRows,
                            nativeEvent,
                        });
                    },
                    onSelectAll: (selected, selectedRows, changeRows) => {
                        handleTableSelect({
                            selected,
                            selectedRows,
                            changeRows,
                        });
                    },
                }}
                columns={columns}
                dataSource={data}
            />
        );
    }
}
export default CommonTable;
