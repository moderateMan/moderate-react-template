import { lazyImport, mapByObj, uuid } from "@COMMON/utils";
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


export type RoutesMapItemT = {
    name:string,
    "icon"?:string,
    "path":string,
    "exact"?:boolean,
    "redirect"?:string,
    "key":string,
    "component"?:any,
    "isNoFormat"?:boolean,
    "search"?:{},
    "param"?:string,
    children?:RoutesMapItemT[];
    routes?:any[]
}

type routesMapType =  {[key: string]: RoutesMapItemT}
/* 路由的注册数据，新建路由在这配置 */
export const routesMap:routesMapType = {
    templates: {
        name: "commonTitle_nest",
        icon: "thunderbolt",
        path: "/pageCenter/nestRoute",
        exact: true,
        redirect: "/pageCenter/light",
        key: uuid()
    },
    
    login: {
        name: "commonTitle_login",
        path: "/pageCenter/login",
        exact: true,
        component: lazyImport(() =>
            import('./login/index')
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
            import('@ROUTES/pageCenter/subRoutes/mdView')
        ),
        key: uuid()
    },
    //light 相关页面
    lightHome: {
        name: "commonTitle_light",
        icon: "table",
        path: "/pageCenter/light",
        exact: true,
        component: lazyImport(() =>
        import('@ROUTES/pageCenter/subRoutes/light/lightHome')
    ),
        key: uuid()
    },
    lightAdd: {
        name: "commonTitle_lightAdd",
        path: "/pageCenter/light/add",
        component: lazyImport(() =>
            import('@ROUTES/pageCenter/subRoutes/light/lightEdit')
        ),
        key: uuid()
    },
    heavyHome: {
        name: "commonTitle_heavy",
        path: "/pageCenter/heavyPage",
        icon: "table",
        exact: true,
        redirect: "/pageCenter/start",
        key: uuid()
    },
    document: {
        path: "/pageCenter/doc/:id",
        name: "commonTitle_doc",
        icon: "read",
        component: lazyImport(() =>
            import('@ROUTES/pageCenter/subRoutes/mdView')
        ),
        key: uuid()
    }
   
}

/* 路由匹配menu的注册数据，新建后台驱动的menu在这配置 */
export const menusMap = {
    [NEST_ID]: {
        ...routesMap.templates,
    },
    [START_ID]: { ...routesMap.moderate },
    [DOC_ID]: { ...routesMap.document },
    [LIGHT_ID]: {
        ...routesMap.lightHome,
        routes: [
            routesMap.lightAdd,
        ]
    },
    [FAST_ID]: { ...routesMap.start },
}

export const defaultRootRoute = {
    [PAGEC_CENTER_TOP]:{
        key: uuid(),exact: true
    }
}

export const menusMapConfig = mapByObj<string,RoutesMapItemT>(menusMap)

