import React, { useEffect, useState, Fragment } from "react";
import "./index.scss";
import { observer } from "mobx-react";

let Point = (props) => {
    const { info, time } = props;
    return (
        <div>
            {info && <div style={{ position: "absolute" }}>{info}</div>}
            <div className="point_point"></div>
            {time && <div style={{ position: "absolute" }}>{time}</div>}
        </div>
    );
};
let Line = (props) => {
    const { isEnd } = props;
    return (
        <Fragment>
            <div className="point_line"></div>
            {isEnd && ">"}
        </Fragment>
    );
};
let data = [
    {},
    { info: "hehehe", time: "time" },
    {},
    { info: "hehehe", time: "time" },
    {},
    { info: "hehehe", time: "time" },
    {},
    { info: "hehehe", time: "time" },
    {},
    { info: "hehehe", time: "time" },
    {},
];
const PointCom = (props) => {
    return (
        <div className="point">
            {data.map((item, index) => {
                return (
                    <Fragment>
                        <Point {...item}></Point>
                        <Line isEnd={data.length - 1 === index}></Line>
                    </Fragment>
                );
            })}
        </div>
    );
};

export default PointCom;
