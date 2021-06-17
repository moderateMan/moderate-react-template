import { lazyImport, mapByObj, uuid } from "COMMON/utils";
export {default as menuLocalConfig} from './menuLocalConfig.json'
export {default as menuRemoteConfig} from './menuRemoteConfig.json'
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
    INTRO_ID:2004,
    FAST_ID:2005,
};

const {LOGIN_TOP,PAGEC_CENTER_TOP} = TOP_ROUTE_ID;
const { NEST_ID, START_ID,  } = ROUTES_REMOTE_ID;
const {HEAVY_ID, LIGHT_ID,DOC_ID,INTRO_ID,FAST_ID } = ROUTES_LOCAL_ID;

/* 路由的注册数据，新建路由在这配置 */
export const routesMap = {
    templates: {
        name: "commonTitle_nest",
        icon: "thunderbolt",
        path: "/pageCenter/nestRoute",
        exact: true,
        redirect: "/pageCenter/light",
        key: uuid()
    },
    pageCenter: {
        name: "commonTitle_pageCenter",
        path: "/pageCenter/",
        exact: true,
        component: lazyImport(() =>
            import('ROUTES/pageCenter')
        ),
        key: uuid()
    },
    login: {
        name: "commonTitle_login",
        path: "/pageCenter/login",
        exact: true,
        component: lazyImport(() =>
            import('ROUTES/login')
        ),
        key: uuid()
    },
    //light 相关页面
    lightHome: {
        name: "commonTitle_light",
        icon: "tag",
        path: "/pageCenter/light",
        exact: true,
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/light/lightHome')
        ),
        key: uuid()
    },
    lightAdd: {
        name: "commonTitle_lightAdd",
        path: "/pageCenter/light/add",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/light/lightEdit')
        ),
        key: uuid()
    },
    lightEdit: {
        name: "commonTitle_lightEdit",
        path: "/pageCenter/light/edit",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/light/lightEdit')
        ),
        key: uuid()
    },
    lightDetail: {
        name: "commonTitle_lightDetail",
        path: "/pageCenter/light/detail",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/light/lightEdit')
        ),
        key: uuid()
    },
    heavyHome: {
        name: "commonTitle_heavy",
        path: "/pageCenter/heavyPage",
        icon: "tags",
        exact: true,
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/heavy/heavyPage')
        ),
        key: uuid()
    },
    heavyAdd: {
        path: "/pageCenter/heavyPage/add",
        name: "commonTitle_heavyAdd",
        icon: "dot-chart",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/heavy/heavyEdit')
        ),
        key: uuid()
    },
    heavyEdit: {
        path: "/pageCenter/heavyPage/edit",
        name: "commonTitle_heavyEdit",
        icon: "dot-chart",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/heavy/heavyEdit')
        ),
        key: uuid()
    },
    heavyDetail: {
        path: "/pageCenter/heavyPage/detail",
        name: "commonTitle_heavyDetail",
        icon: "dot-chart",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/heavy/heavyEdit')
        ),
        key: uuid()
    },
    moderate: {
        path: "/pageCenter/moderate",
        name: "Moderate of React",
        icon: "fire",
        isNoFormat:true,
        redirect: "/pageCenter/start",
        key: uuid()
    },
    start: {
        path: "/pageCenter/start",
        name: "commonTitle_start",
        icon: "like",
        search:{
            docPath:"_start.md"
        },
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/document')
        ),
        key: uuid()
    },
    intro: {
        path: "/pageCenter/intro",
        name: "commonTitle_intro",
        icon: "star",
        search:{
            docPath:"_intro.md"
        },
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/document')
        ),
        key: uuid()
    },
    document: {
        path: "/pageCenter/document/:id",
        name: "commonTitle_doc",
        icon: "read",
        component: lazyImport(() =>
            import('ROUTES/pageCenter/subRoutes/document')
        ),
        key: uuid()
    }
}

/* 路由匹配menu的注册数据，新建后台驱动的menu在这配置 */
export const menusMap = {
    [NEST_ID]: {
        ...routesMap.templates,
    },
    [HEAVY_ID]: {
        ...routesMap.heavyHome,
        routes: [
            routesMap.heavyAdd,
            routesMap.heavyEdit,
            routesMap.heavyDetail,
        ],
    },
    [LIGHT_ID]: {
        ...routesMap.lightHome,
        routes: [
            routesMap.lightAdd,
            routesMap.lightEdit,
            routesMap.lightDetail,
        ],
    },
    [START_ID]: { ...routesMap.moderate },
    [DOC_ID]: { ...routesMap.document },
    [INTRO_ID]: { ...routesMap.intro },
    [FAST_ID]: { ...routesMap.start },
}

export const defaultRootRoute = {
    [PAGEC_CENTER_TOP]:{
        ...routesMap.intro,
        redirect:routesMap.intro.path,
        path:routesMap.pageCenter.path,
        key: uuid(),exact: true
    }
}

export const menusMapConfig = mapByObj(menusMap)

