import { lazyImport, mapByObj, uuid } from "@COMMON/utils";
export { default as menuLocalConfig } from "./menuLocalConfig.json";
export { default as menuRemoteConfig } from "./menuRemoteConfig.json";
/* 远程驱动的menuID */
export const TOP_ROUTE_ID = {
  LOGIN_TOP: 0,
  PAGEC_CENTER_TOP: 1,
};
/* 远程驱动的menuID */
export const ROUTES_REMOTE_ID = {
  NEST_ID: 1001,
  START_ID: 1002,
};

/* 本地自定义的menuID */
export const ROUTES_LOCAL_ID = {
  LIGHT_ID: 2001,
  HEAVY_ID: 2002,
  DOC_ID: 2003,
  INTRO_ID: 2004,
  FAST_ID: 2005,
  STRATEGY_ID: 2006,
  GRAPHICS_ID: 2007,
  FLOW_ID: 2008,
  STRATEGY_TEMP_ID:2009,
  QK_ID:2010,
  QK_VUE_ID:2011,
  QK_REACT_ID:2012
};

const { LOGIN_TOP, PAGEC_CENTER_TOP } = TOP_ROUTE_ID;
const { NEST_ID, START_ID } = ROUTES_REMOTE_ID;
const {
  HEAVY_ID,
  LIGHT_ID,
  DOC_ID,
  INTRO_ID,
  FAST_ID,
  STRATEGY_ID,
  GRAPHICS_ID,
  STRATEGY_TEMP_ID,
  FLOW_ID,
  QK_ID,
  QK_VUE_ID,
  QK_REACT_ID
} = ROUTES_LOCAL_ID;

type SearchT = {
  docPath?:string
  docKey?:string
}

export type RoutesMapItemT = {
  name: string;
  icon?: string;
  path: string;
  exact?: boolean;
  redirect?: string;
  key: string;
  component?: any;
  isNoFormat?: boolean;
  search?: SearchT;
  param?: string;
  subNodes?: RoutesMapItemT[];
  routes?: any[];
  [key: string]: any;
};

type routesMapType = {
  [key: string]: RoutesMapItemT;
};
/* 路由的注册数据，新建路由在这配置 */
export const routesMap: routesMapType = {
  templates: {
    name: "commonTitle_nest",
    icon: "thunderbolt",
    path: "/pageCenter/nestRoute",
    exact: true,
    redirect: "/pageCenter/light",
    key: uuid(),
  },

  login: {
    name: "commonTitle_login",
    path: "/pageCenter/login",
    exact: true,
    component: lazyImport(() => import("./login/index")),
    key: uuid(),
  },
  moderate: {
    path: "/pageCenter/moderate",
    name: "Moderate of React",
    icon: "fire",
    isNoFormat: true,
    key: uuid(),
  },
  intro: {
    path: "/pageCenter/intro",
    name: "commonTitle_intro",
    icon: "star",
    search: {
      docPath: "_intro.md",
    },
    component: lazyImport(() => import("@ROUTES/pageCenter/subRoutes/mdView")),
    key: uuid(),
  },
  start: {
    path: "/pageCenter/start",
    name: "commonTitle_start",
    icon: "like",
    search: {
      docPath: "_start.md",
    },
    component: lazyImport(() => import("@ROUTES/pageCenter/subRoutes/mdView")),
    key: uuid(),
  },
  //light 相关页面
  lightHome: {
    name: "commonTitle_light",
    icon: "table",
    path: "/pageCenter/light",
    exact: false,
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/light/lightHome")
    ),
    key: uuid(),
  },
  lightAdd: {
    name: "commonTitle_lightAdd",
    path: "/pageCenter/light/add",
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/light/lightEdit")
    ),
    key: uuid(),
  },
  heavyHome: {
    name: "commonTitle_heavy",
    path: "/pageCenter/heavyPage",
    icon: "table",
    exact: true,
    redirect: "/pageCenter/start",
    key: uuid(),
  },
  document: {
    path: "/pageCenter/doc",
    name: "commonTitle_doc",
    icon: "read",
    component: lazyImport(() => import("@ROUTES/pageCenter/subRoutes/mdView")),
    key: uuid(),
  },
  strategy: {
    path: "/pageCenter/strategy",
    name: "commonTitle_strategy",
    icon: "read",
    redirect:"/pageCenter/strategy/test",
    key: uuid(),
  },
  strategyTest: {
    path: "/pageCenter/strategy/test",
    name: "commonTitle_strategy_test",
    icon: "read",
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/strategy/main")
    ),
    key: uuid(),
  },
  subApps: {
    path: "/pageCenter/subApps",
    name: "commonTitle_qk_test",
    icon: "read",
    key: uuid(),
  },
  qkVue: {
    path: "/pageCenter/qk/vue",
    name: "commonTitle_qk_vue_test",
    icon: "read",
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/microFrontends/subVue/index")
    ),
    key: uuid(),
  },
  qkReact: {
    path: "/pageCenter/qk/react",
    name: "commonTitle_qk_react_test",
    icon: "read",
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/microFrontends/subReact/index")
    ),
    key: uuid(),
  },
  grahics: {
    name: "commonTitle_graphics",
    icon: "thunderbolt",
    path: "/pageCenter/grahics",
    exact: true,
    redirect: "/pageCenter/grahics/flow",
    key: uuid(),
  },
  flow: {
    path: "/pageCenter/grahics/flow",
    name: "commonTitle_flow",
    icon: "read",
    component: lazyImport(
      () => import("@ROUTES/pageCenter/subRoutes/grahicsEngine/flow")
    ),
    key: uuid(),
  },
};

/* 路由匹配menu的注册数据，新建后台驱动的menu在这配置 */
export const menusMap = {
  [NEST_ID]: {
    ...routesMap.templates,
  },
  [START_ID]: { ...routesMap.moderate },
  [DOC_ID]: { ...routesMap.document },
  [LIGHT_ID]: {
    ...routesMap.lightHome,
    routes: [routesMap.lightAdd],
  },
  [INTRO_ID]: { ...routesMap.intro },
  [FAST_ID]: { ...routesMap.start },
  [STRATEGY_ID]: { ...routesMap.strategy },
  [STRATEGY_TEMP_ID]: { ...routesMap.strategyTest},
  [QK_ID]:{...routesMap.subApps},
  [GRAPHICS_ID]: { ...routesMap.grahics },
  [QK_VUE_ID]:{...routesMap.qkVue},
  [QK_REACT_ID]:{...routesMap.qkReact},
  [FLOW_ID]: { ...routesMap.flow },
};

export const defaultRootRoute = {
  [PAGEC_CENTER_TOP]: {
    key: uuid(),
    exact: true,
  },
};

export const menusMapConfig = mapByObj<string, RoutesMapItemT>(menusMap);
