import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { LocationDescriptor, LocationState } from "history";
import { cloneDeep } from "lodash";
import { Layout, Menu, Button, Modal } from "antd";
import { MenuSlider } from "./components/";
import SubRoutes from "./subRoutes";
import { menusMapConfig } from "@ROUTES/config";
// import docConfig from "DOCS/docConfig.json";
import { getPath } from "@ROUTES/index";
// import request from 'SRC/dataManager/netTrans/request'
import "./index.scss";
import { toJS } from "mobx";

interface Props {
  [prop: string]: any;
}

export interface States {
  subRoutesConfig: any[];
  targetOpenKeys: string[];
  collapsed: boolean;
  userName: string | null;
}

type thisProps = Props & RouteComponentProps;

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
type createDocMenuDataPropsT = {
  item: folderT;
  docList: docListT;
  docTreeMap: any[];
  parentKey: string;
};

@inject("global")
@observer
class PageCenter extends Component<thisProps, States> {
  tempObj = {
    name: "commonTitle_doc",
    icon: "read",
    path: "/pageCenter/document",
    isNoFormat: true,
  };
  docList: string[] = [];
  docTreeMap: any[] = [];
  /**
   * 设置初始化信息
   * userName：后续从台返回信息中取用户名
   * role:后续从台返回信息中取角色信息
   * @type {{theme: string, current: string, collapsed: boolean, mode: string, userName: string | null}}
   */
  constructor(props: thisProps) {
    super(props);
    this.docTreeMap = [];
    this.state = {
      subRoutesConfig: [],
      targetOpenKeys: [], //控制侧边栏菜单展开的key数组信息
      collapsed: false,
      userName: sessionStorage.getItem("userName"),
    };
  }

  async componentDidMount() {
    const {
      global: { getMenu },
      history,
    } = this.props; 

    getMenu().then(async (data:any) => {
        let config:any[] = await this.createSubRoutesConfig();
        this.setState({
            subRoutesConfig: config
        })
    })
    // let config: any[] = await this.createSubRoutesConfig();
    // this.setState({
    //   subRoutesConfig: config,
    // });
  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  createSubRoutesConfig = async () => {
    const { global } = this.props;
    let { menuConfig = [], changeParams } = global;
    menuConfig = toJS(menuConfig);
    let menusMapConfigTemp = new Map(cloneDeep(menusMapConfig));
    const config: any[] = [];
    if (Array.isArray(menuConfig)) {
      menuConfig.forEach((item) => {
        const { menuId, parentId } = item || {};
        if (menuId && menusMapConfigTemp.has(menuId)) {
          const menuInfo = menusMapConfigTemp.get(menuId);
          menuInfo.menuId = menuId;
          if (parentId === 0) {
            config.push(menuInfo);
          } else {
            let configTemp = menusMapConfigTemp.get(parentId);
            if (!configTemp) {
              console.warn(`本地没有相应路由配置(parentId:${parentId})`);
              return;
            }
            let children = configTemp["children"];
            children
              ? children.push(menuInfo)
              : (configTemp["children"] = [menuInfo]);
          }
        }
      });
    }
    return config;
  };

  createDocMenuData = (data: createDocMenuDataPropsT) => {
    //     const { item, docList, docTreeMap, parentKey } = data;
    //     const { children: list } = item;
    //     list.forEach((child) => {
    //         const { children, title = "", name = "", type, path } = child;
    //         if (name.indexOf("_") === 0) {
    //             return
    //         }
    //         docTreeMap[path] = { parentKey, data: child };
    //         let param;
    //         let isFolder = type === "directory"
    //         if (name.indexOf(".md") != -1 || isFolder) {
    //             param = name;
    //             let temp = {
    //                 ...this.tempObj, name: title || name, param, key:
    //                     path, icon: isFolder ? "folder" : "file-markdown"
    //             };
    //             temp.search = {
    //                 docKey: encodeURIComponent(path),
    //             }
    //             if (!isFolder && parentKey) {
    //                 let docPath = parentKey.replace(/\\/g, "/").split("/docs/")[1] + "/" + name;
    //                 temp.search.docPath = docPath;
    //             }
    //             docList.unshift(temp)
    //             // if (children) {
    //             //     temp.children = []
    //             //     this.createDocMenuData({ item: child, docList: temp.children, docTreeMap, parentKey: path })
    //             // }
    //         }
    //     })
    //     return { docList, docTreeMap };
  };

  /**
   * 用户退出方法
   * 调用后台退出方法
   */
  logout = () => {
    const {
      history,
      global: { logoutFn },
    } = this.props;
    let pathData = getPath("login");
    logoutFn(() => history.push(getPath("login")));
  };

  render() {
    const { intl, global } = this.props;
    const { collapsed, subRoutesConfig } = this.state;
    return (
      <Layout style={{ height: "100%" }}>
        <MenuSlider
          {...{ subRoutesConfig, intl, global, collapsed: collapsed }}
        />
        <Layout>
          {/* <TopHeader
                        toggle={this.toggle}
                        collapsed={collapsed}
                        logout={this.logout}
                    ></TopHeader> */}
          <SubRoutes subRoutesConfig={subRoutesConfig} />
        </Layout>
      </Layout>
    );
  }
}

export default PageCenter;
