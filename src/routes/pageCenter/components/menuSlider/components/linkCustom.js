import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import withMaterialHoc from 'COMMON/hocs/withMaterialHoc'
let menuItem = (props) => {
    const { icon, names, pathname, search } = props;
    return <Link style={{
        display: "inline-block",
        width: "100%"
    }} to={{ pathname, search }}>
        {icon ? (
            <Icon className="menuItemInfo" type={icon} />
        ) : <Icon className="menuItemInfo" type={icon} />}
        <span className="menuItemInfo">{names.replace(".md","").replace("1-","")}</span>
    </Link>
}
export default menuItem = withMaterialHoc(menuItem)
