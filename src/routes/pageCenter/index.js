import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { cloneDeep } from 'lodash'
import { Layout, Menu, Icon, Button, Modal } from "antd";
import { MenuSlider, TopHeader } from "./components/";
import SubRoutes from "./subRoutes";
import { menusMapConfig } from "ROUTES/config";
import { getPath } from "ROUTES";
import request from 'SRC/dataManager/netTrans/request'
import "./index.scss";
// import "./index.less";
import { toJS } from "mobx";

@inject("global")
@observer
class PageCenter extends Component {
    /**
     * 设置初始化信息
     * userName：后续从台返回信息中取用户名
     * role:后续从台返回信息中取角色信息
     * @type {{theme: string, current: string, collapsed: boolean, mode: string, userName: string | null}}
     */
    constructor(props) {
        super(props);
        this.docList = [];
        this.docTreeMap = [];
        this.state = {
            subRoutesConfig: [],
            targetOpenKeys: [], //控制侧边栏菜单展开的key数组信息
            collapsed: false,
            userName: sessionStorage.getItem("userName"),
        };
    }

    componentDidMount() {
        const {
            global: { getMenu },
            history,
        } = this.props;

        getMenu().then(async () => {
            let config = await this.createSubRoutesConfig();
            this.setState({
                subRoutesConfig: config
            })
        })
    }

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed })
    };

    createSubRoutesConfig = async () => {
        const { global } = this.props
        let { menuConfig = [], changeParams } = global;
        menuConfig = toJS(menuConfig)
        let menusMapConfigTemp = new Map(cloneDeep([...menusMapConfig]));
        const config = [];
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
                            console.warn(`本地没有相应路由配置(parentId:${parentId})`)
                            return;
                        }
                        let children = configTemp["children"];
                        children ? children.push(menuInfo) : (configTemp["children"] = [menuInfo]);
                    }
                }
            });
        }
        if (process.env.NODE_ENV === "development") {
            await request.post("/getMd", { data: {} }).then((data) => {
                data.forEach((item) => {
                    const { children } = item
                    if (children) {
                        const { docList = [], docTreeMap={} } = this.createDocMenuData({ item, docList: [], docTreeMap: {}, parentKey: 0 })
                        this.docList = docList
                        this.docTreeMap = docTreeMap;
                        changeParams({
                            docList: docList,
                            docTreeMap: docTreeMap
                        })
                    }
                })
                let temp = config.find((item) => {
                    return item.menuId === 2003
                })
                if (temp) {
                    let children;
                    if (!temp["children"]) children = temp["children"] = []
                    temp.children = this.docList;
                }
            })
        }

        return config;
    }

    tempObj = {
        name: "commonTitle_doc",
        icon: "read",
        path: "/pageCenter/document",
        isNoFormat: true,
    }

    createDocMenuData = (data) => {
        const { item, docList, docTreeMap, parentKey } = data;
        const { children: list } = item;
        list.forEach((child) => {
            const { children, title = "", name = "", type, path } = child;
            if (name.indexOf("_") === 0) {
                return
            }
            docTreeMap[path] = { parentKey, data: child };
            let param;
            let isFolder = type === "directory"
            if (name.indexOf(".md") != -1 || isFolder) {
                param = name;
                let temp = {
                    ...this.tempObj, name: title || name, param, key:
                        path, icon: isFolder ? "folder" : "file-markdown"
                };

                temp.search = {
                    docKey: encodeURIComponent(path),
                }
                if (!isFolder && parentKey) {
                    let docPath = parentKey.replace(/\\/g,"/").split("/docs/")[1] + "/" + name;
                    temp.search.docPath = docPath;
                }

                docList.unshift(temp)
                if (children) {
                    temp.children = []
                    this.createDocMenuData({ item: child, docList: temp.children, docTreeMap, parentKey: path })
                }
            }
        })
        return { docList, docTreeMap };
    }

    /**
     * 用户退出方法
     * 调用后台退出方法
     */
    logout = () => {
        const {
            history,
            global: { logoutFn },
        } = this.props;
        logoutFn(() => history.push(getPath("login")));
    };

    render() {
        const { intl, global } = this.props;
        const { collapsed, subRoutesConfig } = this.state;
        return (
            <Layout style={{ height: "100%" }}>
                <MenuSlider {...{ subRoutesConfig, intl, global, collapsed: collapsed }} />
                <Layout>
                    <div className="componentGlobal">我用的less</div>
                    {/* <TopHeader
                        toggle={this.toggle}
                        collapsed={collapsed}
                        logout={this.logout}
                    ></TopHeader>
                    <SubRoutes subRoutesConfig={subRoutesConfig} /> */}
                </Layout>
            </Layout>
        );
    }
}

export default PageCenter;
