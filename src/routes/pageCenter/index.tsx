import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";
import { cloneDeep } from "lodash";
import { Layout } from "antd";
import { MenuSlider, TopHeader } from "./components/";
import SubRoutes from "./subRoutes";
import { menusMapConfig, RoutesMapItemT } from "@ROUTES/config";
import { getPath } from "@ROUTES/index";
import request from "@DATA_MANAGER/netTrans/myReuqest";
import "./index.scss";
import mdData from '@SRC/docs/docsConfig'
import { toJS } from "mobx";
import { Global } from "@DATA_MANAGER/stores";

interface Props {
  global: Global
  [key: string]: any;
}


type MdDataT = {
  path: string;
  "name"?: string
  title?: string;
  type?: string;
  children?: MdDataT[]
}

type DocTreeMapItem = {
  parentKey: string,
  data: MdDataT
}

type CreateDocMenuDataFT = {
  item: MdDataT,
  docList: RoutesMapItemT[],
  docTreeMap: {
    [key: string]: DocTreeMapItem
  },
  parentKey: string,
}

export interface States {
  subRoutesConfig: RoutesMapItemT[];
  targetOpenKeys: string[];
  collapsed: boolean;
  userName: string | null;
}

type thisProps = Props & RouteComponentProps;

@inject("global")
@observer
class PageCenter extends Component<thisProps, States> {
  tempObj = {
    name: "commonTitle_doc",
    icon: "read",
    path: "/pageCenter/doc",
    isNoFormat: true,
  };
  docList: RoutesMapItemT[] = [];
  docTreeMap!: {
    [key: string]: DocTreeMapItem
  };
  /**
   * 设置初始化信息
   * userName：后续从台返回信息中取用户名
   * role:后续从台返回信息中取角色信息
   * @type {{theme: string, current: string, collapsed: boolean, mode: string, userName: string | null}}
   */
  constructor(props: thisProps) {
    super(props);
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

    getMenu({}).then(async () => {
      let config: RoutesMapItemT[] = await this.createSubRoutesConfig();
      this.setState({
        subRoutesConfig: config,
      });
    });

  }

  toggle = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  createSubRoutesConfig = async () => {
    const { global } = this.props;
    let { menuConfig = [], changeParams } = global;
    menuConfig = toJS(menuConfig);
    let menusMapConfigTemp = new Map(cloneDeep(Array.from(menusMapConfig)));
    const config: RoutesMapItemT[] = [];
    if (Array.isArray(menuConfig)) {
      menuConfig.forEach((item) => {
        const { menuId, parentId } = item || {};
        if (menuId && menusMapConfigTemp.has(menuId)) {
          const menuInfo: RoutesMapItemT | undefined = menusMapConfigTemp.get(menuId)!;
          menuInfo.menuId = menuId;
          if (parentId === 0) {
            config.push(menuInfo);
          } else {
            let configTemp: RoutesMapItemT | undefined = menusMapConfigTemp.get(parentId);
            if (!configTemp) {
              console.warn(`本地没有相应路由配置(parentId:${parentId})`);
              return;
            }
            let subNodes = configTemp.subNodes;
            subNodes
              ? subNodes.push(menuInfo)
              : (configTemp.subNodes = [menuInfo]);
          }
        }
      });
    }

    // 根据md数据进行分析获得菜单渲染数据
    let processMdData = (data: MdDataT[]) => {
      const { children } = data[0];
      if (children) {
        const { docList = [], docTreeMap = {} } = this.createDocMenuData({
          item: data[0],
          docList: [],
          docTreeMap: {},
          parentKey: "0",
        });
        this.docList = docList;
        this.docTreeMap = docTreeMap;

        changeParams({
          docList: docList,
          docTreeMap: docTreeMap,
        });
      }
      let temp = config.find((item) => {
        return item.menuId === 2003;
      });
      if (temp) {
        temp.subNodes = this.docList;
      }
    }

    if (process.env.NODE_ENV === "development") {
      await request.post("/getMd", { data: {} }).then((res) => {
        processMdData(res as MdDataT[])
      });
    } else {
      processMdData(mdData)
    }
    return config;
  };

  createDocMenuData = (data: CreateDocMenuDataFT) => {
    const { item, docList, docTreeMap, parentKey } = data;
    const { children: list } = item;
    list!.forEach((child: MdDataT) => {
      const { children, title = "", name = "", type, path } = child;
      if (name.indexOf("_") === 0) {
        return;
      }
      docTreeMap[path] = { parentKey, data: child };
      let param;
      let isFolder = type === "directory";
      if (name.indexOf(".md") != -1 || isFolder) {
        param = name;
        let temp: RoutesMapItemT = {
          ...this.tempObj,
          name: title || name,
          param,
          key: path,
          icon: isFolder ? "folder" : "file-markdown",
        };

        temp.search = {
          docKey: encodeURIComponent(path),
        };
        if (!isFolder && parentKey) {
          temp.search.docPath = parentKey!="0"?
          parentKey.replace(/\\/g, "/").split("/docs/")[1] + "/" + name:name;
        }

        docList.unshift(temp);
        if (children) {
          temp.subNodes = [];
          this.createDocMenuData({
            item: child,
            docList: temp.subNodes,
            docTreeMap,
            parentKey: path,
          });
        }
      }
    });
    return { docList, docTreeMap };
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
          <TopHeader
            toggle={this.toggle}
            collapsed={collapsed}
            logout={this.logout}
          ></TopHeader>
          <SubRoutes subRoutesConfig={subRoutesConfig} />
        </Layout>
      </Layout>
    );
  }
}

export default PageCenter;
