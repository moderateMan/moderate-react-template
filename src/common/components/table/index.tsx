import React, { Fragment } from "react";
import { Button, Table } from "antd";
import "./index.scss";
import { toJS } from "mobx";
import { uuid } from "@COMMON/utils";

type CommonSearchTablePropsT = {
  [key: string]: any;
};

class CommonTable extends React.Component<CommonSearchTablePropsT> {
  render() {
    const {
      columns,
      data = [],
      pagination,
      handleTableSelect = () => {},
      btnInTableConfig = [],
      expandedRowRender,
      onExpand,
      other = {},
      isJustShow,
    } = this.props;
    data.forEach((item:any) => {
      if (!item.key) item.key = uuid();
    });
    return (
      <Fragment>
        <div className="btnWrapper">
          {btnInTableConfig.map((item:any, index:number) => {
            const { label, handleClick, icon, type = "", rest } = item;
            return (
              <Button
                type={type}
                className="posAddBtn"
                onClick={handleClick}
                key={index}
                {...rest}
              >
                {label}
              </Button>
            );
          })}
        </div>
        <Table
          rowKey={(record) => {
            return record.id || record.key;
          }}
          pagination={pagination}
          rowSelection={
            !isJustShow
              ? {
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
                }
              : undefined
          }
          columns={columns}
          dataSource={Array.isArray(toJS(data)) ? data : []}
          expandedRowRender={expandedRowRender}
          onExpand={onExpand}
          {...other}
        />
      </Fragment>
    );
  }
}
export default CommonTable;
