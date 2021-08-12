import React from "react";
import { Link } from "react-router-dom";
import { AlertTwoTone } from "@ant-design/icons";
import withMaterialHoc from "@COMMON/hocs/withMaterialHoc";
type MenuItemPropsT = {
  icon: string;
  names: string;
  pathname: string;
  search: string;
};
let MenuItem: React.FC<MenuItemPropsT> = (props) => {
  const { icon, names, pathname, search } = props;
  return (
    <Link
      style={{
        display: "inline-block",
        width: "100%",
      }}
      to={{ pathname, search }}
    >
      {icon ? (
        <AlertTwoTone className="menuItemInfo" type={icon} />
      ) : (
        <AlertTwoTone className="menuItemInfo" type={icon} />
      )}
      <span className="menuItemInfo">
        {names.replace(".md", "").replace("1-", "")}
      </span>
    </Link>
  );
};
export default withMaterialHoc(MenuItem);
