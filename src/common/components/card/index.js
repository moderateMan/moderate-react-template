import React from "react";
import "./index.scss";
export default function (props) {
    const { children } = props;
    return <div className="commonCardWrapper">{children}</div>;
}
