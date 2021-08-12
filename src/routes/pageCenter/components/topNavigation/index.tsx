import React from "react";
import "./index.css";
import {
  Link,
  withRouter,
  matchPath,
  RouteComponentProps,
  match,
} from "react-router-dom";
import { Breadcrumb } from "antd";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { menusMapConfig, RoutesMapItemT } from "@ROUTES/config";
let urlSearchRecord: {
  [key: string]: any;
} = {};
//TODOCME
type TopNavigationPropsT = {
  menuConfig: {
    parentId: string;
    [key: string]: any;
  }[];
} & RouteComponentProps &
  WrappedComponentProps;

type TargetDataItemT = RoutesMapItemT;
type TargetDataT = RoutesMapItemT[];
const TopNavigation: React.FC<TopNavigationPropsT> = (props) => {
  const {
    location: { pathname, search },
    intl: { formatMessage },
    menuConfig,
  } = props;
  let pathnameTemp = pathname;
  /* 动态的判断当前的路由所处位置，来确定是否需要添加折叠父节点的path信息 */
  let nestPathName = "";
  let nestPath = "";
  let matchData: match<{ path: string; exact: string; strict: string }> | null;
  function findItemName(
    targetData: TargetDataT | Map<string, RoutesMapItemT>,
    targetUrl: string
  ) {
    let value: TargetDataItemT | [string, RoutesMapItemT];
    let temp: TargetDataItemT;
    for (value of targetData) {
      if (Array.isArray(value)) {
        temp = value[1];
      } else {
        temp = value;
      }
      const { path, children = [], routes = [], isNoFormat } = temp;
      let matchData = matchPath(targetUrl, {
        path: path,
        exact: true,
        strict: true,
      });
      if (matchData) {
        let itemName = temp.name;
        if (!isNoFormat) {
          /* 国际化 */
          itemName = formatMessage({
            id: itemName,
          });
        }

        return itemName;
      } else {
        let temp: TargetDataT = [...children, ...routes] as TargetDataT;
        if (temp.length) {
          let findValue: string = findItemName(temp, targetUrl);
          if (findValue) return findValue;
        }
      }
    }
    return "";
  }
  for (const [menuId, menuItem] of menusMapConfig) {
    matchData = matchPath(pathnameTemp, {
      path: menuItem.path,
      exact: true,
      strict: true,
    });
    if (matchData && pathnameTemp === menuItem.path) {
      pathnameTemp = matchData.path.split("/:")[0];
      menuConfig.find((item) => {
        if (menuId === item.menuId && item.parentId) {
          let parent = menusMapConfig.get(item.parentId);
          if (parent) {
            const { name, isNoFormat } = parent;
            nestPathName = isNoFormat
              ? name
              : formatMessage({
                  id: parent.name,
                });
            nestPath = parent.path;
          }
        }
      });
      break;
    }
  }
  let pathSnippets = pathnameTemp
    .split("/")
    .slice(1)
    .filter((i) => i);
  urlSearchRecord[pathSnippets[pathSnippets.length - 1]] = search;
  /* 根据当前的location来得出面包屑导航的显示 */
  let breadcrumbItems = [];
  if (nestPathName) {
    breadcrumbItems.push(
      <Breadcrumb.Item key={nestPath}>
        <Link to={nestPath}>{nestPathName}</Link>
      </Breadcrumb.Item>
    );
  }
  const extraBreadcrumbItems = pathSnippets.map((item, index) => {
    /* 排除最顶层的路由 */
    if (index == 0) return;
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    let itemName = findItemName(menusMapConfig, url);
    if (
      !itemName &&
      index === pathSnippets.length - 1 &&
      matchData &&
      matchData.path.indexOf("/:")
    ) {
      itemName = findItemName(menusMapConfig, matchData.url);
    }

    let search = urlSearchRecord[item] ? urlSearchRecord[item] : "";
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url + search}>{itemName || "未知"}</Link>
      </Breadcrumb.Item>
    );
  });
  breadcrumbItems = [...breadcrumbItems, ...extraBreadcrumbItems];
  return (
    <div className="titleWrapper">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default injectIntl(withRouter(TopNavigation));
