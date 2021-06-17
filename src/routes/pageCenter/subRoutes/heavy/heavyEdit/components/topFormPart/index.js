import React from "react";
import { observer } from "mobx-react";
import DetailStateCom from "./detailStateCom";
import EditableStateCom from "./editableStateCom";
import "./index.scss";
export default observer((props) => {
    const { isJustShow } = props;
    return isJustShow ? (
        <DetailStateCom {...props} />
    ) : (
        <EditableStateCom {...props} />
    );
});
