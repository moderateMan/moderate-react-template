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
import {  RoutesMapItemT,routesMap } from "@ROUTES/config";
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
    location: { pathname, search},
    intl: { formatMessage },
    menuConfig,
  } = props;
  let breadcrumbItems = []
  let strArr = pathname.split("/").slice(1)
  let pathStrArr = [];
  
  for(let i = 0;i<strArr.length;i++){
    if(i>0&&i <= strArr.length-1){
      let patnStr = `/${strArr.slice(0,i).join("/")}`;
      pathStrArr.push(patnStr)
    }
  }

  for(let i=0;i<pathStrArr.length;i++){
    let str = pathStrArr[i];
    for(let key in routesMap){
      let routeData = routesMap[key];
      const {path,name,isNoFormat} = routeData;
      let flag = false;
      let itemName
      if (!isNoFormat) {
        /* 国际化 */
        itemName = name&&formatMessage({
          id: name,
        });
      }
      let pathTemp = Array.isArray(path)?routeData.path[0].split("/:")[0]:path.split("/:")[0]
      if(pathTemp === str){
        flag = true;
      }
      if(flag){
        breadcrumbItems.push(
          <Breadcrumb.Item key={str}>
            <Link to={str}>{itemName}</Link>
          </Breadcrumb.Item>
        );
        break;
      }
    }
   
  }
  
  return (
    <div className="titleWrapper">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default injectIntl(withRouter(TopNavigation));
