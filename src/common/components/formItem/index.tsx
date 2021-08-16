import React, { Fragment } from "react";
import formItemHoc from "@COMMON/hocs/formItemHoc";

type CommonFormItemPT = {
    form:any
    data:any
    getFromItem:any
}

class CommonFormItem extends React.Component<CommonFormItemPT> {
    render() {
        const { form, data = {}, getFromItem, ...restProps } = this.props;
        return (
            <Fragment>
                {getFromItem({
                    ...data,
                    ...form,
                    ...restProps,
                })}
            </Fragment>
        );
    }
}

export default formItemHoc(CommonFormItem);
