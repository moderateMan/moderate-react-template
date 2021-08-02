import React, { Fragment } from "react";
import formItemHoc from "COMMON/hocs/formItemHoc";

@formItemHoc
class CommonFormItem extends React.Component {
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

export default CommonFormItem;
