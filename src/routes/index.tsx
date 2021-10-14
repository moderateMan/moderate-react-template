import React, { useEffect } from "react";
import { LocationDescriptor, LocationState } from "history";
import { Empty } from "antd";
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

import { ACCESS_TOKEN } from "@COMMON/constants";
import Storage from "@COMMON/storage";
import store from "@DATA_MANAGER/index";
import Login from "@ROUTES/login/index";
import PageCenter from "@ROUTES/pageCenter";
import { routesMap } from "./config";
import { toJS } from "mobx";

type AuthRoutePropsT = {
  exact?: boolean;
  path?: string;
  component?: any;
  isLoginRoute?: boolean;
  [key: string]: any;
};
function AuthRoute(props: AuthRoutePropsT) {
  const { isLoginRoute, ...rest } = props;
  const {
    global: { isLogin },
  } = store;
  let token = Storage.getStorage(ACCESS_TOKEN);
  if (isLogin || isLoginRoute || token) {
    return <Route {...rest} />;
  } else {
    return <Redirect to="/login" />;
  }
}

type folderItemT = {
  name: string;
  search: {} | string;
  param: string;
  path: string;
};

type folderT = {
  children: folderItemT[];
};
type docListITemT = {
  name: string;
  children: [];
};

type docListT = docListITemT[];
type strDataT = string[];

export let getCurrentPathData = () => {
  let data = {
    pathname:"", 
    search:""
  };
  const {
    global: { isHash },
  } = store;
  if(isHash){
    data.pathname = window.location.hash.split("?")[0].replace("#","")
    data.search = window.location.hash.split("?")[1]
  }
  return data;
};

export function getPath(
  pathKey: string | object,
  options?: { [key: string]: any }
): LocationDescriptor<LocationState> {
  let temp: LocationDescriptor<LocationState> = {
    pathname: "",
    search: "",
  };
  if (typeof pathKey === "string") {
    pathKey = pathKey.trim();
  }
  let route;
  if (typeof pathKey === "object") {
    let queryData = Object.entries(pathKey)[0];
    route = Object.values(routesMap).find((item: any) => {
      return item[queryData[0]] == queryData[1];
    });
  } else {
    route = pathKey in routesMap ? routesMap[pathKey] : null;
  }
  if (!route) {
    console.warn("该路由并没有配置！");
    return temp;
  }
  const { search, redirect, path, param } = route;
  let searchTemp = "";
  if (typeof search === "object") {
    for (let key in search) {
      searchTemp += `${searchTemp ? "&" : ""}${key}=${
        search[key as keyof typeof search]
      }`;
    }
  }
  let pathnameTemp;
  if (redirect) {
    pathnameTemp = `${redirect}${param ? "/" + param : ""}`;
  } else {
    pathnameTemp = `${path.split("/:")[0]}${param ? "/" + param : ""}`;
  }

  temp = {
    pathname: pathnameTemp,
    search: searchTemp,
  };
  if (typeof options === "object") {
    temp = {
      ...temp,
      ...options,
    };
  }
  return temp;
}

let findMd = (folder: folderT, mdName: string) => {
  const { children } = folder;
  return children.find((item) => {
    return item.name === mdName;
  });
};
let findFloder = (docList: docListT, folderNames: string[] = []) => {
  let targetFolder;
  let docListTemp = docList;
  for (let i = 0; i < folderNames.length; i++) {
    let folderName = folderNames[i];
    targetFolder =
      docListTemp.find((item) => {
        const { name, children } = item;
        if (!name.includes(".md") && folderName === name) {
          return children;
        }
      }) || targetFolder;
    if (targetFolder) {
      docListTemp = targetFolder.children;
    } else {
      break;
    }
  }
  return targetFolder;
};

export function getDocPath(strData: strDataT, docList: docListT) {
  let folderData: string[] = [];
  let mdName: string = "";
  if (strData.length === 1) {
    mdName = strData[0];
  } else {
    folderData = strData.slice(0, strData.length - 1);
    mdName = strData[strData.length - 1];
  }
  let docListTemp = toJS(docList);
  let folder = findFloder(docListTemp, folderData);
  let targetMd = folder && findMd(folder, mdName);
  let temp;
  if (targetMd) {
    const { search, param, path } = targetMd;
    let searchTemp = "";
    if (typeof search === "object") {
      for (let key in search) {
        searchTemp += `${searchTemp ? "&" : ""}${key}=${
          search[key as keyof typeof search]
        }`;
      }
    }
    let pathnameTemp = `${path.split("/:")[0]}${param ? "/" + param : ""}`;
    return (temp = {
      pathname: pathnameTemp,
      search: searchTemp,
    });
  }
  return temp;
}

/**
 * 缓动函数
 * @param t 动画已消耗时间
 * @param b 原始值
 * @param c 目标值
 * @param d 持续时间
 */
export function sineaseOut(t: number, b: number, c: number, d: number) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
}

/**
 * 将元素滚动到可见位置
 * @param scroller 要滚动的元素
 * @param viewer 需要可见的元素
 * @param justify
 */
export function scrollToView(scroller: Element, value: number) {
  if (!scroller) {
    return;
  }
  const scroll = value;
  const scrollStart = 0;
  let start: number = 0;
  const step = (timestamp: number) => {
    if (!start) {
      start = timestamp;
    }
    let stepScroll = sineaseOut(timestamp - start, 0, scroll, 500);
    let total = (scroller.scrollTop = scrollStart + stepScroll);
    if (total < scrollStart + scroll) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
}

function Routes() {
  let history = useHistory();
  let location = useLocation();
  const {
    global: { changeParams },
  } = store;
  useEffect(() => {
    const { pathname, search } = location;
    changeParams({
      current: decodeURIComponent(pathname + search),
    });
    if (!history["_listenCount" as keyof typeof history]) {
      history["_listenCount" as keyof typeof history]++;
      history.listen((locationState, type) => {
        const {
          global: { current, scrollData, changeParams },
        } = store;
        let node = document.getElementsByClassName("ant-layout-content")[0];
        if (!node) {
          return;
        }
        // node.scrollTop = 0;
        //最新页面的Key，存上就行
        let newkey = decodeURIComponent(
          locationState.pathname + locationState.search
        );
        /* 找一下看看有没有记录值 */
        let recordValue = scrollData[newkey as keyof typeof scrollData];
        if (typeof recordValue === "number") {
          scrollToView(node, recordValue);
        }
        // 取值（过去的）存一下，old
        let oldKey = current;
        let scrollDataTemp = { ...toJS(scrollData), [oldKey]: node.scrollTop };
        if (type === "POP") {
          //POP 情况下node.scrollTop已经被设置成0了
          changeParams({
            current: newkey,
          });
        } else {
          changeParams({
            current: newkey,
            scrollData: scrollDataTemp,
          });
        }
      });
    }
  }, []);
  return (
    <Switch>
      <AuthRoute isLoginRoute={true} exact={true} path="/" component={Login} />
      <AuthRoute isLoginRoute={true} path="/login" component={Login} />
      <AuthRoute path="/pageCenter" component={PageCenter} />
      <Route>
        <Empty
          style={{
            position: "absolute",
            marginTop: "30%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </Route>
    </Switch>
  );
}

export default Routes;
