import React from "react";
import "./index.scss";
import formItemHoc from "COMMON/hocs/formItemHoc";
let EditableContext;
@formItemHoc
class EditableCell extends React.Component {
    constructor(props) {
        super(props);
        EditableContext = props.context;
        this.state = {
            refresh: 0,
        };
    }

    renderCell = (form) => {
        debugger
        const {
            editing,
            dataIndex,
            record = {},
            children,
            formConfig = {},
            getFromItem,
            ...restProps
        } = this.props;
        let formConfigTemp = { ...formConfig };
        //防止修改值之后，一旦出发刷新，就会初始化的问题，应该还原为修改后的记录值---待考证
        formConfigTemp.record = record;
        (record[dataIndex] || parseInt(record[dataIndex]) === 0) &&
            (formConfigTemp.initialValue = record[dataIndex]);
        return (
            <td style={{
                textAlign:"center"
            }}>
                {editing ? getFromItem({
                            dataIndex,
                            formConfig: formConfigTemp,
                            ...form,
                        }): (
                    children
                )}
            </td>
        );
    };

    render() {
        return EditableContext ? (
            <EditableContext.Consumer>
                {this.renderCell}
            </EditableContext.Consumer>
        ) : (
            <div></div>
        );
    }
}

export default EditableCell;
