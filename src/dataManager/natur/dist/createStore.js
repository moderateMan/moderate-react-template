"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:12:36
 * @modify date 2019-08-09 17:12:36
 * @desc [description]
 */
var utils_1 = require("./utils");
var MapCache_1 = __importDefault(require("./MapCache"));
/**
 *
 * @param modules 同步模块, 你的store模块
 * @param lazyModules 懒加载模块， 必填，如果没有可以传{}, 如果不填，那么ts的类型推断会有问题
 * @param param2 选项配置，详情见文档
 */
var createStore = function (modules, lazyModules, _a) {
    if (modules === void 0) { modules = {}; }
    var _b = _a === void 0 ? {} : _a, _c = _b.initStates, initStates = _c === void 0 ? {} : _c, _d = _b.middlewares, middlewares = _d === void 0 ? [] : _d, _e = _b.interceptors, interceptors = _e === void 0 ? [] : _e;
    var t = (__assign(__assign({}, modules), lazyModules));
    /**
     * 存放store实例
     */
    var currentStoreInstance;
    /**
     * 存放createStore构造函数传入的全局初始化state
     */
    var currentInitStates = __assign({}, initStates);
    /**
     * 存放着每个模块最初的state数据
     * 用于globalResetStates方法重置store中的所有state
     */
    var resetStateData = {};
    /**
     * 用户调用globalSetStates时，有的模块可能是懒加载模块，还未加载好，
     * 所以需要缓存好懒加载模块的state，等到setModule初始化了该模块，则会立即调用globalSetStates更新该模块的数据
     */
    var globalSetStateCache = {};
    /**
     * 主要存放，已经加载的store的state，maps，actions
     * 这里存放的是原始的maps，actions，并非经过代理后的maps和actions，或者说并非是natur使用者获取的maps和actions
     */
    var currentModules = {};
    /**
     * 懒加载模块配置
     */
    var currentLazyModules = __assign({}, lazyModules);
    /**
     * 监听器对象
     * key是模块的名字
     * value是存放该模块对应的监听器的数组
     * 在模块的state变更，模块的删除，初始化时，会通知对应的监听器
     */
    var listeners = {};
    /**
     * 存放所有模块的名字
     */
    var allModuleNames;
    /**
     * 存放createStore中传入的middlewares配置
     */
    var currentMiddlewares = __spreadArray([], middlewares, true);
    var currentInterceptors = __spreadArray([], interceptors, true);
    /**
     * 这是一个缓存，用于存放，每个模块对应的setState代理
     * 在每个模块生成对应的action代理时，会产生一个setState的方法，
     * 这个setState是用于改变对应模块的state的
     * 同时这个setState会使用洋葱模型包装好middlewares，所以在调用setState时，会先调用middlewares
     */
    var setStateProxyWithMiddlewareCache = {};
    /**
     * 存放每个模块对应的actions代理缓存
     * natur使用者获取的action并非原始的action，而是代理的action
     * 代理action调用后可以经过中间件，然后将返回值作为新的state更新，并通知对应的监听器
     * 在getModule中生成action代理是有性能消耗的，所以需要加一个缓存
     * 那么保证action代理生成后，下一次getModule可以一直使用上一次生成过的action代理
     * 所以你获取的action代理会一直相同，这在react的性能优化时也同样有用
     */
    var actionsProxyCache = {};
    var mapsCache = {};
    /**
     * 与mapsCache一样是maps的缓存
     * 但是数据结构不同，mapsCache第二层的key是模块对应的maps中的key，这里则是一个数组，方便做循环遍历使用
     */
    var mapsCacheList = {};
    /**
     * 此方法使用在setModule中，
     * 使用createStore中的初始化的state，来替换待加载模块的state数据
     * @param moduleName 模块名
     * @param storeModule 待加载模块的原始数据
     */
    var replaceModule = function (moduleName, storeModule) {
        var res;
        // 缓存每个模块的初始化状态，供globalResetStates使用
        resetStateData[moduleName] = storeModule.state;
        if (!!currentInitStates[moduleName]) {
            res = __assign(__assign({}, storeModule), { state: currentInitStates[moduleName] });
            delete currentInitStates[moduleName];
        }
        else {
            res = __assign({}, storeModule);
        }
        return res;
    };
    /**
     * 查看该模块是否已经加载
     * @param moduleName 模块名
     */
    var hasModule = function (moduleName) {
        return !!currentModules[moduleName];
    };
    /**
     * 查看该模块是否已经加载，如果没有则报错
     * @param moduleName 模块名
     */
    var checkModuleIsValid = function (moduleName) {
        if (!hasModule(moduleName)) {
            var errMsg = "module: " + moduleName + " is not valid!";
            // console.error(errMsg);
            throw new Error(errMsg);
        }
    };
    /**
     * 删除一个模块的action proxy缓存
     * @param moduleName 模块名
     */
    var clearActionsProxyCache = function (moduleName) {
        delete actionsProxyCache[moduleName];
    };
    /**
     * 删除一个模块的map proxy缓存
     * @param moduleName 模块名
     */
    var clearMapsProxyCache = function (moduleName) {
        delete mapsCache[moduleName];
        mapsCacheList[moduleName].forEach(function (i) { return i.destroy(); });
        delete mapsCacheList[moduleName];
    };
    /**
     * 当模块对应的state更新时，需要通知该模块的maps缓存，state已经改变
     * 所以在下一次获取maps的值时，应该先看看maps的依赖有没有变化，
     * @param moduleName
     */
    var mapsCacheShouldCheckForValid = function (moduleName) {
        mapsCacheList[moduleName].forEach(function (i) { return i.shouldCheckCache(); });
    };
    /**
     * 清除setStateProxyWithMiddlewareCache对应模块的缓存
     * @param moduleName
     */
    var clearSetStateProxyWithMiddlewareCache = function (moduleName) {
        delete setStateProxyWithMiddlewareCache[moduleName];
    };
    /**
     * 清除模块对应的一切缓存
     * @param moduleName 模块名
     */
    var clearAllCache = function (moduleName) {
        clearMapsProxyCache(moduleName);
        clearActionsProxyCache(moduleName);
        clearSetStateProxyWithMiddlewareCache(moduleName);
    };
    /**
     * 获取所有模块的名字，包括懒加载模块的名字
     */
    var getAllModuleName = function () {
        if (!allModuleNames) {
            allModuleNames = Object.keys(__assign(__assign({}, currentModules), currentLazyModules));
        }
        return allModuleNames;
    };
    /**
     * 模块发生变动，通知对应的监听器
     * @param moduleName
     * @param me 模块变动的详情
     */
    var runListeners = function (moduleName, me) {
        return Array.isArray(listeners[moduleName]) &&
            listeners[moduleName].forEach(function (listener) { return listener(me); });
    };
    /**
     * 用于更新模块对应的state，并发出通知
     * 通知模块监听器
     * 通知模块中的maps缓存state更新了
     * 如果新的state全等于旧的state则不会触发更新
     * @param param0
     */
    var setState = function (_a) {
        var moduleName = _a.moduleName, newState = _a.state, actionName = _a.actionName;
        var stateHasNoChange = currentModules[moduleName].state === newState;
        if (stateHasNoChange) {
            return newState;
        }
        currentModules[moduleName].state = newState;
        mapsCacheShouldCheckForValid(moduleName);
        runListeners(moduleName, {
            type: "update",
            actionName: actionName,
        });
        return currentModules[moduleName].state;
    };
    /**
     * 全局统一设置state
     * 主要的应用场景是，异步加载所有的state配置时，需要更新到对应的模块中
     * 更新会走中间件，中间中的actionName参数是'globalSetStates'
     * @param states
     */
    var globalSetStates = function (states) {
        Object.keys(states).forEach(function (moduleName) {
            if (hasModule(moduleName)) {
                if (!setStateProxyWithMiddlewareCache[moduleName]) {
                    createDispatch(moduleName);
                }
                setStateProxyWithMiddlewareCache[moduleName]({
                    moduleName: moduleName,
                    actionName: "globalSetStates",
                    state: states[moduleName],
                });
            }
            else {
                globalSetStateCache[moduleName] =
                    states[moduleName];
            }
        });
    };
    /**
     * 全局统一重置state
     * 主要的应用场景是，ssr不需要重新createStore只需要重置一下state就行，或者在业务中退出登录后需要清空数据
     * 更新会走中间件，中间中的actionName参数是'globalResetStates'
     * 可以配置include：只重置哪些模块
     * 可以配置exclude：不重置哪些模块
     * exclude优先级大于include
     * @param states
     */
    var globalResetStates = function (_a) {
        var _b = _a === void 0 ? {} : _a, include = _b.include, exclude = _b.exclude;
        var shouldResetModuleNames = Object.keys(resetStateData).filter(hasModule);
        if (exclude) {
            var stringExclude_1 = exclude.filter(function (ex) { return typeof ex === "string"; });
            var regExpExclude_1 = exclude.filter(function (ex) { return typeof ex !== "string"; });
            // 过滤不需要重制状态的模块
            shouldResetModuleNames = shouldResetModuleNames.filter(function (mn) {
                return (stringExclude_1.indexOf(mn) === -1 &&
                    !regExpExclude_1.some(function (reg) { return reg.test(mn); }));
            });
        }
        if (include) {
            var stringInclude_1 = include.filter(function (ex) { return typeof ex === "string"; });
            var regExpInclude_1 = include.filter(function (ex) { return typeof ex !== "string"; });
            // 如果存在include配置，则只重制include配置中的模块
            shouldResetModuleNames = shouldResetModuleNames.filter(function (mn) {
                return (stringInclude_1.indexOf(mn) > -1 ||
                    regExpInclude_1.some(function (reg) { return reg.test(mn); }));
            });
        }
        shouldResetModuleNames.forEach(function (mn) {
            if (!setStateProxyWithMiddlewareCache[mn]) {
                createDispatch(mn);
            }
            setStateProxyWithMiddlewareCache[mn]({
                moduleName: mn,
                actionName: "globalResetStates",
                state: resetStateData[mn],
            });
        });
    };
    /**
     * 设置模块
     * 如果该模块已经存在，则覆盖旧的模块，并清空就模块的缓存
     * 最后通知监听器
     * @param moduleName 模块名
     * @param storeModule 模块的原始数据
     */
    var setModule = function (moduleName, storeModule) {
        var _a, _b;
        if (!(0, utils_1.isStoreModule)(storeModule)) {
            var errMsg = "setModule: storeModule " + moduleName + " is illegal!";
            // console.error(errMsg);
            throw new Error(errMsg);
        }
        var isModuleExist = hasModule(moduleName);
        currentModules = __assign(__assign({}, currentModules), (_a = {}, _a[moduleName] = replaceModule(moduleName, storeModule), _a));
        if (isModuleExist) {
            clearAllCache(moduleName);
        }
        else {
            allModuleNames = undefined;
        }
        if (!mapsCache[moduleName]) {
            mapsCache[moduleName] = {};
            mapsCacheList[moduleName] = [];
        }
        runListeners(moduleName, { type: "init" });
        if (moduleName in globalSetStateCache) {
            var s = globalSetStateCache[moduleName];
            delete globalSetStateCache[moduleName];
            globalSetStates((_b = {},
                _b[moduleName] = s,
                _b));
        }
        return currentStoreInstance;
    };
    /**
     * 销毁模块，清空缓存以及对应的原始数据
     * @param moduleName
     */
    var destroyModule = function (moduleName) {
        delete currentModules[moduleName];
        delete currentLazyModules[moduleName];
        allModuleNames = undefined;
        clearAllCache(moduleName);
    };
    /**
     * 移除模块，会调用destroyModule，并发送通知
     * @param moduleName
     */
    var removeModule = function (moduleName) {
        destroyModule(moduleName);
        runListeners(moduleName, { type: "remove" });
        return currentStoreInstance;
    };
    /**
     * 设置懒加载模块
     * @param moduleName
     * @param lazyModule
     */
    var setLazyModule = function (moduleName, lazyModule) {
        allModuleNames = undefined;
        currentLazyModules[moduleName] = lazyModule;
        return currentStoreInstance;
    };
    /**
     * 移除懒加载模块
     * @param moduleName
     */
    var removeLazyModule = function (moduleName) {
        allModuleNames = undefined;
        delete currentLazyModules[moduleName];
        return currentStoreInstance;
    };
    /**
     * 计算maps的值，如果首次获取maps则会先建立缓存对象
     * @param moduleName
     */
    var createMapsProxy = function (moduleName) {
        var maps = currentModules[moduleName].maps;
        if (maps === undefined) {
            return undefined;
        }
        var proxyMaps = {};
        for (var key in maps) {
            if (maps.hasOwnProperty(key)) {
                if (mapsCache[moduleName][key] === undefined) {
                    var targetMap = maps[key];
                    var mapCacheSecondParam = [];
                    if (Array.isArray(targetMap)) {
                        mapCacheSecondParam = targetMap;
                    }
                    else if (targetMap.length !== 0) {
                        mapCacheSecondParam = [
                            function () { return currentModules[moduleName].state; },
                            targetMap,
                        ];
                    }
                    else {
                        mapCacheSecondParam = [function () { return undefined; }, targetMap];
                    }
                    mapsCache[moduleName][key] = new MapCache_1.default(function () { return currentModules[moduleName].state; }, mapCacheSecondParam);
                    mapsCacheList[moduleName].push(mapsCache[moduleName][key]);
                }
                var targetWatcher = mapsCache[moduleName][key];
                proxyMaps[key] = targetWatcher.getValue();
            }
        }
        return proxyMaps;
    };
    /**
     * 创建action代理
     * @param moduleName
     */
    var createActionsProxy = function (moduleName) {
        if (!!actionsProxyCache[moduleName]) {
            return actionsProxyCache[moduleName];
        }
        var actionsProxy = __assign({}, currentModules[moduleName].actions);
        var dispatch = createDispatch(moduleName);
        Object.keys(actionsProxy).forEach(function (key) {
            return (actionsProxy[key] = function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                return dispatch.apply(void 0, __spreadArray([key], data, false));
            });
        });
        actionsProxyCache[moduleName] = actionsProxy;
        return actionsProxy;
    };
    /**
     * 获取module
     * @param moduleName
     */
    var getModule = function (moduleName) {
        checkModuleIsValid(moduleName);
        var proxyModule = {
            state: currentModules[moduleName].state,
            actions: createActionsProxy(moduleName),
            maps: createMapsProxy(moduleName),
        };
        return proxyModule;
    };
    /**
     * 执行对应模块对应的action
     * @param moduleName
     * @param actionName
     */
    var dispatch = function (moduleName, actionName) {
        var _a;
        var arg = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            arg[_i - 2] = arguments[_i];
        }
        if (hasModule(moduleName)) {
            var moduleProxyActions = createActionsProxy(moduleName);
            if (actionName in moduleProxyActions) {
                return (_a = moduleProxyActions)[actionName].apply(_a, arg);
            }
        }
        return undefined;
    };
    /**
     * 获取原始的module数据
     * @param moduleName
     */
    var getOriginModule = function (moduleName) {
        checkModuleIsValid(moduleName);
        return currentModules[moduleName];
    };
    /**
     * 获取某个懒加载模块
     * @param moduleName
     */
    var getLazyModule = function (moduleName) {
        if (!!currentLazyModules[moduleName]) {
            return currentLazyModules[moduleName];
        }
        var errMsg = "getLazyModule: " + moduleName + " is not exist";
        // console.error(errMsg);
        throw new Error(errMsg);
    };
    /**
     * 加载某个懒加载模块，如果已经加载就返回以及加载的模块
     * @param moduleName
     */
    var loadModule = function (moduleName) {
        if (hasModule(moduleName)) {
            return Promise.resolve(getModule(moduleName));
        }
        return getLazyModule(moduleName)().then(function (loadedModule) {
            if ((0, utils_1.isStoreModule)(loadedModule)) {
                setModule(moduleName, loadedModule);
            }
            else if ((0, utils_1.isStoreModule)(loadedModule.default)) {
                setModule(moduleName, loadedModule.default);
            }
            return getModule(moduleName);
        });
    };
    var runAcion = function (_a) {
        var _b;
        var moduleName = _a.moduleName, actionName = _a.actionName, actionArgs = _a.actionArgs;
        checkModuleIsValid(moduleName);
        var targetModule = currentModules[moduleName];
        return (_b = targetModule.actions)[actionName].apply(_b, actionArgs);
    };
    /**
     * 创建dispath
     * 这里是拼接filter，action，middleware，setState的地方
     * @param moduleName
     */
    var createDispatch = function (moduleName) {
        checkModuleIsValid(moduleName);
        var middlewareParams = {
            setState: setState,
            getState: function () { return currentModules[moduleName].state; },
            getMaps: function () { return createMapsProxy(moduleName); },
            dispatch: dispatch,
        };
        var middlewareChain = currentMiddlewares.map(function (middleware) {
            return middleware(middlewareParams);
        });
        var setStateProxyWithMiddleware = (utils_1.compose.apply(void 0, middlewareChain))(setState);
        var filterChain = currentInterceptors.map(function (middleware) {
            return middleware(middlewareParams);
        });
        var runActionProxyWithInterceptors = (utils_1.compose.apply(void 0, filterChain))(function (filterRecord) {
            return setStateProxyWithMiddleware({
                moduleName: moduleName,
                actionName: filterRecord.actionName,
                state: runAcion(filterRecord),
            });
        });
        setStateProxyWithMiddlewareCache[moduleName] = setStateProxyWithMiddleware;
        return function (actionName) {
            var actionArgs = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                actionArgs[_i - 1] = arguments[_i];
            }
            return runActionProxyWithInterceptors({
                moduleName: moduleName,
                actionName: actionName,
                actionArgs: actionArgs,
                actionFunc: currentModules[moduleName]['actions'][actionName],
            });
        };
    };
    /**
     * 监听某个模块
     * @param moduleName
     * @param listener
     */
    var subscribe = function (moduleName, listener) {
        if (!listeners[moduleName]) {
            listeners[moduleName] = [];
        }
        listeners[moduleName].push(listener);
        return function () {
            if (Array.isArray(listeners[moduleName])) {
                listeners[moduleName] = listeners[moduleName].filter(function (lis) { return listener !== lis; });
            }
        };
    };
    /**
     * 销毁store
     */
    var destroy = function () {
        Object.keys(currentModules).forEach(destroyModule);
        currentInitStates = {};
        currentLazyModules = {};
        listeners = {};
        allModuleNames = undefined;
        currentMiddlewares = [];
        currentInterceptors = [];
    };
    /**
     * 初始化store
     */
    var init = function () {
        Object.keys(modules).forEach(function (moduleName) {
            setModule(moduleName, modules[moduleName]);
        });
    };
    /**
     * 获取所有state
     * key是模块名
     * value是模块对应的值
     */
    var getAllStates = function () {
        return Object.keys(currentModules).reduce(function (as, key) {
            as[key] = currentModules[key].state;
            return as;
        }, {});
    };
    init();
    currentStoreInstance = {
        getAllModuleName: getAllModuleName,
        getModule: getModule,
        getOriginModule: getOriginModule,
        getLazyModule: getLazyModule,
        loadModule: loadModule,
        setModule: setModule,
        removeModule: removeModule,
        hasModule: hasModule,
        setLazyModule: setLazyModule,
        removeLazyModule: removeLazyModule,
        subscribe: subscribe,
        destroy: destroy,
        dispatch: dispatch,
        globalSetStates: globalSetStates,
        globalResetStates: globalResetStates,
        getAllStates: getAllStates,
        type: null,
    };
    return currentStoreInstance;
};
exports.default = createStore;
