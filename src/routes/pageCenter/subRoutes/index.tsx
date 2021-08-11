/**
 * 文件名称: src/pages/Console_Gui
 *
 * 文件描述:内容组件文件
 */
import React, { Component, Suspense } from "react";
import {
  Route,
  Switch,
  Redirect,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";
import { inject, observer } from "mobx-react";
import { injectIntl,WrappedComponentProps } from "react-intl";
import { Layout } from "antd";
import CommonLoading from "@COMMON/components/loading";
// import { TopNavigation } from "../components";
import {
  CSSTransition,
  TransitionGroup,
  SwitchTransition,
} from "react-transition-group";
import { defaultRootRoute, TOP_ROUTE_ID } from "@ROUTES/config";

import "./index.scss";

/**内容组件，自带默认样式，其下可嵌套任何元素，只能放在 Layout 中*/
const Content = Layout.Content;
type SubRoutesPropsT = {
  [key: string]: any;
} & RouteComponentProps&WrappedComponentProps;

type SubRoutesPropsTT = {
    [key: string]: any;
  }&WrappedComponentProps
@inject("global")
@observer
class SubRoutes extends Component<SubRoutesPropsT, any> {
  constructor(props: SubRoutesPropsT) {
    super(props);
    this.state = {
      contentMinHeight: "",
    };
  }

  componentDidMount() {
      const {intl}  = this.props;
    this.getContentMinHeight();
    window.addEventListener("resize", () => {
      this.getContentMinHeight();
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => {
      this.getContentMinHeight();
    });
  }

  getContentMinHeight = () => {
    const minHeight = document.documentElement.clientHeight - 135;
    this.setState(() => ({ contentMinHeight: `${minHeight}px` }));
  };

  renderRoute = () => {
    const { subRoutesConfig } = this.props;
    const renderRouterItem = (routerItem: any) => {
      const {
        path,
        component,
        exact,
        redirect,
        children = [],
        routes = [],
        search,
      } = routerItem;
      //children为子menu，一种特殊的嵌套路由
      //routes为嵌套路由数组
      let routeArr = [...children, ...routes];
      if (routeArr.length) {
        routeArr = routeArr.map((item) => renderRouterItem(item));
        //判断如果父组件也具备组件，就添加其route
        if (component) {
          routeArr.push(
            <Route exact={exact} key={path} path={path} component={component} />
          );
        }
        if (redirect) {
          let toObj: any = {
            pathname: redirect,
          };
          if (search) {
            let searchData = Object.entries(search);
            toObj.search = "";
            searchData.forEach((item, key) => {
              toObj.search += `${key === 0 ? "?" : "/"}${item[0]}=${item[1]}`;
            });
          }
          routeArr.push(
            <Route
              key={path}
              path={path}
              exact={exact}
              render={() => <Redirect to={toObj} />}
            />
          );
        }
        return routeArr;
      } else {
        if (redirect) {
          let toObj: any = {
            pathname: redirect,
          };
          if (search) {
            let searchData = Object.entries(search);
            toObj.search = "";
            searchData.forEach((item, key) => {
              toObj.search += `${key === 0 ? "?" : "/"}${item[0]}=${item[1]}`;
            });
          }
          return (
            <Route
              key={path}
              path={path}
              exact={exact}
              render={() => <Redirect to={toObj} />}
            />
          );
        }
        return <Route exact key={path} path={path} component={component} />;
      }
    };
    let routes = subRoutesConfig.map((routerItem: any) =>
      renderRouterItem(routerItem)
    );
    // const { PAGEC_CENTER_TOP } = TOP_ROUTE_ID;
    // if (PAGEC_CENTER_TOP in defaultRootRoute) {
    //     let rootRoute = renderRouterItem(defaultRootRoute[PAGEC_CENTER_TOP])
    //     routes.unshift(rootRoute)
    // }
    return routes;
  };
  /**
   * react 页面加载方法
   * @returns {*}
   */
  render() {
    /**
     * 定义内容页面属性
     * 加载内容页面路由
     */
    const {
      location,
      global: { menuConfig, isLoading },
    } = this.props;
    const { pathname } = window.location;
    let classNames = "forward-" + "from-right";
    return (
      <Content className="content" id="content">
        <div className="maintainStyle maintain-small-style">
          {/* <TopNavigation menuConfig={menuConfig} /> */}
          <Suspense fallback={<CommonLoading />}>
            <TransitionGroup
              className={"router-wrapper"}
              childFactory={(child) =>
                React.cloneElement(child, { classNames })
              }
            >
              <CSSTransition timeout={500} key={pathname} unmountOnExit={true}>
                <Switch location={location} key={pathname}>
                  {this.renderRoute()}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </Suspense>
          {isLoading && <CommonLoading />}
        </div>
      </Content>
    );
  }
}

export default injectIntl(withRouter(SubRoutes) as React.ComponentType<any>);

