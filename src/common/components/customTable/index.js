import React from "react";
import PropTypes from "prop-types";
import { Prompt, Link } from "react-router-dom";
import { inject } from "mobx-react";
import { toJS } from "mobx";
import { Table, Popconfirm, Form, Button, message, Icon } from "antd";
import { uuid } from "COMMON/utils";
import contextHoc from "COMMON/hocs/contextHoc";
import EditableCell from "./editableCell";
import "./index.scss";


const EditableContext = React.createContext();

@inject("global")
class CustomTable extends React.Component {
  static propTypes = {
    isNewAddFlag: PropTypes.bool, //标记是否正在添加条目
    pageStore: PropTypes.object, //所属的页面store
    handleCreate: PropTypes.func, //回调-创建
    handleEdit: PropTypes.func, //回调-编辑
    handleSave: PropTypes.func, //回调-保存
    handleTableSelect: PropTypes.func, //回调-勾选
    handleDelete: PropTypes.func, //回调-删除
    handleDeleteBtnClick: PropTypes.func, //回调-table整体的删除
    editingKey: PropTypes.any, //当前编辑项的索引值
    columns: PropTypes.array, //antd-table-配置项：columns-(重点关注)
    data: PropTypes.array, //antd-table-配置项：dataSorce-(重点关注)
    other: PropTypes.object, //其他的antd-table的配置项-(不关注)
  };

  static defaultProps = {
    pageStore: {},
    columns: [],
    data: [],
    handleCreate: () => { },
    handleSave: () => { },
    handleTableSelect: () => { },
    handleDeleteBtnClick: () => { },
    editingKey: 0,
  };

  constructor(props) {
    super(props);

    this.state = { data: props.data, currentPageIndex: 1, pageSize: 10, isEdit: false };
    this.updateColumnsData();
    this.EditableCell = contextHoc(EditableCell, EditableContext);
  }

  componentDidMount() {
    const { handleSaveChildForm } = this.props;
    handleSaveChildForm &&
      handleSaveChildForm &&
      handleSaveChildForm(this.props.form);
  }
  handleEditDefault = () => {
    const { pageStore } = this.props;
    const { changeParams = () => { } } = pageStore;
    changeParams({ editingKey: "" });
  };

  handleDeleteDefault = (value) => {
    const {
      data,
      handleSave,
      global: { locale },
    } = this.props;

    let tableDataSource = toJS(data);
    let temp =
      tableDataSource.length > 1
        ? tableDataSource.filter((item) => {
          if (Array.isArray(value)) {
            return !value.includes(item.key);
          } else if (typeof value === "object") {
            return item.key != value.key;
          } else {
            return item.key != value;
          }
        })
        : tableDataSource;
    if (tableDataSource.length == 1) {
      return message.warning({
        content: locale == "zh" ? "至少一条" : "At least one item",
      });
    }
    handleSave && handleSave({ data: temp });
  };
  updateColumnsData = () => {
    const {
      isJustShow,
      columns,
      global: { locale },
    } = this.props;
    this.columns = isJustShow
      ? columns
      : [
        ...columns,
        {
          title: locale == "zh" ? "操作" : "Actions",
          dataIndex: "operation",
          width: "160px",
          align: "center",
          render: (text, record) => {
            const { editingKey } = this.props;
            const editable = this.isEditing(record);
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {editable ? (
                  <span>
                    <EditableContext.Consumer>
                      {(form) => (
                        <div style={{ marginTop: 9 }}>
                          <a
                            onClick={() => this.save(form, record.key)}
                            style={{ marginRight: 8 }}
                          >
                            <Icon
                              style={{
                                fontSize: 15,
                                color: "#1890FF",
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                              type="check"
                            />
                          </a>
                          <Popconfirm
                            title={
                              locale == "zh"
                                ? "取消编辑？"
                                : "Sure to cancel ?"
                            }
                            cancelText="No"
                            okText="Yes"
                            onConfirm={() => this.cancel(record)}
                          >
                            <a>
                              <Icon
                                style={{
                                  fontSize: 15,
                                  color: "#1890FF",
                                  marginLeft: 10,
                                  marginRight: 10,
                                }}
                                type="delete"
                              />
                            </a>
                          </Popconfirm>
                        </div>
                      )}
                    </EditableContext.Consumer>
                  </span>
                ) : (
                  <span>
                    <a
                      disabled={!!editingKey}
                      onClick={() => this.edit(record.key)}
                    >
                      <Icon
                        style={{
                          fontSize: 15,
                          color: "#1890FF",
                          marginLeft: 10,
                          marginRight: 10,
                        }}
                        type="edit"
                      />
                    </a>
                    <Icon
                      style={{
                        fontSize: 15,
                        color: "#1890FF",
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                      onClick={() => {
                        this.handleDelete(record);
                      }}
                      type="delete"
                    />
                  </span>
                )}
              </div>
            );
          },
        },
      ];
  };

  //设置标识isNewAddFlag-标志当前是否为新添加行的状态
  setNewAddFlag = (value) => {
    this.setState({
      isEdit: value
    })
    const { pageStore, handleSwitchNewAddFlag } = this.props;
    const { changeParams = () => { } } = pageStore;
    if (handleSwitchNewAddFlag) {
      handleSwitchNewAddFlag(value);
    } else {
      changeParams({
        isNewAddFlag: value,
      });
    }
  };

  isEditing = (record) => {
    return record.key === this.props.editingKey;
  };

  cancel = (item) => {
    const { isNewAddFlag } = this.props;
    this.handleEdit({ editingKey: "" });
    if (isNewAddFlag) {
      this.handleDelete(item);
      this.setNewAddFlag(false);
    }
    this.setState({
      isEdit: false
    })
  };

  deletePosItem(key) {
    const { data, handleSave } = this.props;
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      newData.splice(index, 1);
      handleSave({
        data: newData,
      });
      this.handleEdit({
        editingKey: "",
      });
    }
  }
  save = (form, key) => {
    const { transformNewRowData } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      row = transformNewRowData ? transformNewRowData(row) : row;
      this.setNewAddFlag(false);
      const { data, handleSave } = this.props;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        handleSave({
          data: newData,
        });
        this.handleEdit({
          editingKey: "",
        });
      } else {
        newData.push(row);
        handleSave({
          data: newData,
        });
        this.handleEdit({
          editingKey: "",
        });
      }
    });
  };

  edit(key) {
    this.setState({
      isEdit: true
    })
    this.handleEdit({ editingKey: key });
  }

  handleEvent = (params) => {
    const { handleEvent } = this.props;
    handleEvent();
  };

  render() {
    const { currentPageIndex, pageSize, isEdit } = this.state;
    const {
      handleTableSelect,
      handleCreate,
      editingKey,
      form,
      handleDeleteBtnClick,
      other = {},
      data,
      isJustShow,
      isShowDeleteBtn = true,
      isHideAddNewRow,
      global: { locale },
    } = this.props;
    this.updateColumnsData();
    let tableData = toJS(data);
    const {
      handleDelete = this.handleDeleteDefault.bind(this),
      handleEdit = this.handleEditDefault.bind(this),
    } = this.props;
    this.handleEdit = handleEdit;
    this.handleDelete = handleDelete;
    tableData.forEach((item) => {
      if (!item.key) item.key = item.posItemId || item.uuid || uuid();
    });
    const components = {
      body: {
        cell: this.EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.inputType || "input",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          formConfig: col.formConfig || {},
        }),
      };
    });
    return (
      <div className="commonCustomTable">
        <EditableContext.Provider value={form}>
          <Prompt
            when={isEdit}
            message={(location) =>
              locale == "zh"
                ? "当前正在编辑，你确定离开这个页面么？"
                : "One item is still in editing mode, are you sure to leave this page now?"
            }
          />
          {!isJustShow && isShowDeleteBtn && (
            <div className="btnWrapper3">
              <Button
                className="posAddBtn"
                icon="delete"
                onClick={handleDeleteBtnClick}
              >
                {locale == "zh" ? "删除" : "Delete"}
              </Button>
            </div>
          )}
          <Table
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
            components={components}
            dataSource={tableData}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              current: currentPageIndex,
              pageSize: pageSize,
              onChange: (current) => {
                this.setState({
                  currentPageIndex: current,
                });
                this.cancel(editingKey);
              },
            }}
            {...other}
          />
        </EditableContext.Provider>
        <div className={tableData.length > 0 ? "saveButton2" : "saveButton"}>
          {!isJustShow && !isHideAddNewRow && (
            <Button
              className="addBtn2"
              onClick={() => {
                if (editingKey) {
                  message.warning({
                    content:
                      locale == "zh"
                        ? "当前正处在编辑阶段！"
                        : "One item is still in editing",
                  });
                  return;
                }
                const { extraJude } = this.props;
                if (extraJude && !extraJude()) return;
                this.setNewAddFlag(true);
                handleCreate();
                if (tableData.length === pageSize) {
                  this.setState((prevState) => ({
                    currentPageIndex: prevState.currentPageIndex + 1,
                  }));
                }
                this.setState({
                  isEdit: true
                })
              }}
              icon="plus"
              type="dashed"
            >
              {locale == "zh" ? "添加一行" : "New Line"}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Form.create()(CustomTable);
