import React, { useEffect } from "react";
import {
  findCurrentMenuInfo,
  filterParams,
  getUrlParam,
  getParentLoop,
} from "@COMMON/utils";
import { CommonAnimateWha as AnimateWrapper } from "@COMMON/components/index";
import { StarOutlined } from "@ant-design/icons";
import { Menu, Layout, Button, Modal } from "antd";
import { ROUTES_REMOTE_ID, ROUTES_LOCAL_ID } from "@ROUTES/config";
import { getCurrentPathData } from "@ROUTES/index";
import injectInternational from "@COMMON/hocs/intlHoc";
import { useReducerEx } from "@COMMON/hooks/";
import { RouteMenu } from "../index";
import styles from "./index.module.scss";
import useStores from "@COMMON/hooks/useStores";
import request from "@DATA_MANAGER/netTrans/myReuqest";
import { LinkCustom } from "./components";
const { SubMenu } = Menu;
const { Item: MenuItem } = Menu;
const { Sider } = Layout;

const initState = {
  openKeys: [],
  selectKeys: [],
  isEditMenu: false,
  remoteMenuData: [],
  localMenuData: [],
};

type MenuSliderProps = {
  collapsed: boolean;
  intlData: any;
  value?: string;
  onChange?: (value: string) => void;
  [key: string]: any;
};

const MenuSliderCom: React.FC<MenuSliderProps> = (props) => {
  const [state, dispatch] = useReducerEx({ state: initState });
  const { global } = useStores();
  const { docTreeMap = [] } = global;
  const { openKeys, selectKeys, isEditMenu, remoteMenuData, localMenuData } =
    state;
  const { intl = {}, subRoutesConfig, collapsed, intlData } = props;
  const { formatMessage = () => {} } = intl;
  debugger;
  const { pathname, search } = getCurrentPathData();
  const { menuItem, nestKeys = [] } = findCurrentMenuInfo(
    subRoutesConfig,
    pathname
  );
  let docKey = getUrlParam(decodeURIComponent(search), "docKey");
  useEffect(() => {
    if (!collapsed) {
      if (docKey && docKey in docTreeMap) {
        const { parentKey } = docTreeMap[docKey];
        if (parentKey || parentKey === 0) {
          let nestKeysTemp;
          if (parentKey === 0) {
            nestKeysTemp = [...nestKeys];
          } else {
            nestKeysTemp = [
              ...nestKeys,
              ...getParentLoop({
                childKey: parentKey,
                docTreeMap,
                parentKeys: [],
              }),
              parentKey,
            ];
          }

          let selectKeysTemp = [];
          if (menuItem) {
            selectKeysTemp.push(menuItem.key);
          }
          selectKeysTemp.push(docKey);
          dispatch({
            selectKeys: selectKeysTemp,
            openKeys: nestKeysTemp,
          });
        }
      } else {
        if (menuItem) {
          dispatch({
            selectKeys: [menuItem.key],
            openKeys: nestKeys,
          });
        }
      }
    } else {
      dispatch({
        selectKeys: [],
        openKeys: [],
      });
    }
  }, [subRoutesConfig, docTreeMap.length, collapsed, docKey]);
  /* 去掉为空的属性，目的是传入空的openKeys引起的动画消失的问题 */
  let menuParams = filterParams({
    className: "menu",
    theme: "light",
    mode: "inline",
    selectedKeys: collapsed ? [] : selectKeys,
    openKeys: collapsed ? [] : openKeys,
    style: {
      height: "calc(100% - 64px)",
      overflowX: "hidden",
      paddingBottom: 100,
    },
    onSelect: ({ key }: { key: string[] }) => {
      dispatch({
        selectKeys: key,
      });
    },
    onOpenChange: (openKeys: string[]) => {
      dispatch({
        openKeys,
      });
    },
  });
  const renderMenuItem = (menuItem: any, generation = 0) => {
    const {
      name,
      icon,
      children,
      path,
      search,
      redirect,
      param,
      key,
      isNoFormat,
    } = menuItem;
    const names = isNoFormat ? name : formatMessage({ id: name });
    /**
     * 判断是否存在子导航
     */
    if (children && children.length) {
      return (
        <SubMenu
          key={key}
          title={
            <span>
              <StarOutlined className="menuItemInfo" type={icon} />
              <span className="menuItemInfo">{names}</span>
            </span>
          }
        >
          {children.map((item: any) => renderMenuItem(item, generation + 1))}
        </SubMenu>
      );
    } else {
      let searchTemp = "";
      if (typeof search === "object") {
        for (let key in search) {
          searchTemp += `${searchTemp ? "&" : ""}${key}=${search[key]}`;
        }
      }
      let pathnameTemp;
      //  redirect的条目排除
      if (redirect) {
        pathnameTemp = `${redirect}${param ? "/" + param : ""}`;
      } else {
        pathnameTemp = `${path.split("/:")[0]}${param ? "/" + param : ""}`;
      }
      let paddingLeftTemp = 48;
      paddingLeftTemp += (generation - 1) * 24;
      return (
        <MenuItem key={key}>
          <LinkCustom
            {...{
              style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                paddingLeft: paddingLeftTemp,
              },
              icon,
              names,
              pathname: pathnameTemp,
              search: searchTemp,
              intlData,
            }}
          />
        </MenuItem>
      );
    }
  };
  type tempItem = {
    menuId: number;
    parentId: number;
    children?: any[];
  };
  type tempT = tempItem[];
  let transTreeData = (data: tempT, parentId: number) => {
    let temp: tempT = [];
    data.forEach((item: tempItem) => {
      const { menuId } = item;
      if (Array.isArray(item.children)) {
        temp = [...temp, ...transTreeData(item.children, menuId)];
      }
      temp.push({ menuId: menuId, parentId: parentId });
    });
    return temp;
  };

  let handleTreeDataChange = (data: tempT = []) => {
    let remoteData: tempT = [];
    let localData: tempT = [];
    data = transTreeData(data, 0);
    data.forEach((item) => {
      const { menuId } = item;
      if (
        Object.values(ROUTES_REMOTE_ID).includes(menuId) &&
        Object.values(ROUTES_LOCAL_ID).includes(menuId)
      ) {
        console.log("远程的id和本地的id重复了！");
      }
      if (Object.values(ROUTES_REMOTE_ID).includes(menuId)) {
        remoteData.push(item);
      } else if (Object.values(ROUTES_LOCAL_ID).includes(menuId)) {
        localData.push(item);
      }
    });
    dispatch({
      remoteMenuData: remoteData,
      localMenuData: localData,
    });
  };
  return (
    <Sider className={styles.content} collapsed={collapsed}  width={258} theme={"light"}>
      <div className={styles.logoE}></div>
      <div className={styles.logo}>
        <AnimateWrapper
          className={styles.fade}
          toggleClass={styles.show}
          action={!collapsed}
        >
          Moderate
        </AnimateWrapper>
      </div>
      {isEditMenu ? (
        <RouteMenu handleTreeDataChange={handleTreeDataChange} {...props} />
      ) : (
        <Menu {...menuParams}>
          {subRoutesConfig.map((menu: any) => renderMenuItem(menu))}
        </Menu>
      )}
      {process.env.NODE_ENV === "development" && (
        <AnimateWrapper
          className={styles.fadeEx}
          toggleClass={styles.show}
          action={!collapsed}
        >
          <Button
            type={"primary"}
            onClick={() => {
              if (isEditMenu) {
                Modal.confirm({
                  // icon: <ApiFill />,
                  title: "友情提示",
                  content: "该操作会修改项目中的menuConfig文件，确定么？",
                  cancelText: "取消",
                  okText: "确定",
                  onOk: () => {
                    dispatch({
                      isEditMenu: !isEditMenu,
                    });
                    request
                      .post("/test", {
                        data: { remoteMenuData, localMenuData },
                      })
                      .then(() => {});
                  },
                });
              } else {
                dispatch({
                  isEditMenu: !isEditMenu,
                });
              }
            }}
            style={{ position: "absolute", bottom: 0, left: 0, width: "100%" }}
          >
            {isEditMenu ? intlData.save : intlData.commonTitle_SETTING}
          </Button>
        </AnimateWrapper>
      )}
    </Sider>
  );
};

export default injectInternational("menuTitle")(MenuSliderCom);
