"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:03
 * @modify date 2019-08-09 17:13:03
 * @desc [description]
 */
var react_1 = __importDefault(require("react"));
var hoist_non_react_statics_1 = __importDefault(require("hoist-non-react-statics"));
var utils_1 = require("./utils");
var injectCache_1 = require("./injectCache");
var Loading = function () { return null; };
var connect = function (moduleNames, depDecs, storeGetter, WrappedComponent, LoadingComponent) {
    var Connect = /** @class */ (function (_super) {
        __extends(Connect, _super);
        function Connect(props) {
            var _this = _super.call(this, props) || this;
            _this.injectModules = {};
            _this.unsubStore = function () { };
            _this.destroyCache = function () { };
            _this.isSubscribing = false;
            /**
             * 组件还未渲染
             */
            _this.isUnmounted = true;
            _this.state = {
                storeStateChange: {},
                modulesHasLoaded: false,
            };
            // 初始化store, integralModulesName(合法模块名)
            var _a = _this.init(), store = _a.store, integralModulesName = _a.integralModulesName;
            _this.store = store;
            _this.integralModulesName = integralModulesName;
            var unLoadedModules = integralModulesName.filter(function (mn) { return !store.hasModule(mn); });
            _this.unLoadedModules = unLoadedModules;
            // 初始化模块是否全部加载完成标记
            _this.state.modulesHasLoaded = !unLoadedModules.length;
            _this.setStoreStateChanged = _this.setStoreStateChanged.bind(_this);
            _this.LoadingComponent = LoadingComponent || Loading;
            _this.loadLazyModule();
            return _this;
        }
        Connect.prototype.loadLazyModule = function () {
            var _this = this;
            var _a = this, store = _a.store, unLoadedModules = _a.unLoadedModules;
            var modulesHasLoaded = this.state.modulesHasLoaded;
            if (!modulesHasLoaded) {
                Promise.all(unLoadedModules.map(function (mn) { return store.loadModule(mn); }))
                    .then(function () {
                    if (_this.isUnmounted === false) {
                        _this.setState({
                            modulesHasLoaded: true,
                        });
                    }
                    else {
                        _this.state.modulesHasLoaded = true;
                    }
                })
                    .catch(function () {
                    if (_this.isUnmounted === false) {
                        _this.setState({
                            modulesHasLoaded: false,
                        });
                    }
                    else {
                        _this.state.modulesHasLoaded = true;
                    }
                });
            }
        };
        Connect.prototype.subscribe = function () {
            /**
             * 如果组件已经订阅了，或者lazy模块还没加载完，就不用订阅了
             */
            if (this.isSubscribing || this.state.modulesHasLoaded === false) {
                return;
            }
            // 初始化store监听
            this.initStoreListner();
            this.initDiff();
            this.isSubscribing = true;
        };
        Connect.prototype.unsubscribe = function () {
            this.unsubStore();
            this.destroyCache();
            this.unsubStore = function () { };
            this.destroyCache = function () { };
            this.isSubscribing = false;
            this.isUnmounted = true;
        };
        Connect.prototype.setStoreStateChanged = function (moduleName) {
            if (!depDecs[moduleName]) {
                this.setState({
                    storeStateChange: {},
                });
            }
            else if (this.storeModuleDiff) {
                var hasDepChanged_1 = false;
                this.storeModuleDiff[moduleName].forEach(function (diff) {
                    diff.shouldCheckCache();
                    if (diff.hasDepChanged()) {
                        hasDepChanged_1 = true;
                    }
                });
                if (hasDepChanged_1) {
                    this.setState({
                        storeStateChange: {},
                    });
                }
            }
            else {
                this.setState({
                    storeStateChange: {},
                });
            }
        };
        Connect.prototype.initDiff = function (moduleDepDec, store) {
            if (moduleDepDec === void 0) { moduleDepDec = depDecs; }
            if (store === void 0) { store = this.store; }
            var _a = (0, injectCache_1.initDiff)(moduleDepDec, store), diff = _a.diff, destroy = _a.destroy;
            this.storeModuleDiff = diff;
            this.destroyCache = destroy;
        };
        Connect.prototype.initStoreListner = function () {
            var _a = this, store = _a.store, integralModulesName = _a.integralModulesName, setStoreStateChanged = _a.setStoreStateChanged;
            var unsubscribes = integralModulesName.map(function (mn) { return store.subscribe(mn, function () { return setStoreStateChanged(mn); }); });
            this.unsubStore = function () { return unsubscribes.forEach(function (fn) { return fn(); }); };
        };
        Connect.prototype.componentWillUnmount = function () {
            this.unsubscribe();
        };
        Connect.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var propsChanged = !(0, utils_1.isEqualWithDepthLimit)(this.props, nextProps, 1);
            var stateChanged = nextState.modulesHasLoaded !== this.state.modulesHasLoaded || nextState.storeStateChange !== this.state.storeStateChange;
            return propsChanged || stateChanged;
        };
        Connect.prototype.init = function () {
            var store = storeGetter();
            var allModuleNames = store.getAllModuleName();
            // 获取store中存在的模块
            var integralModulesName = moduleNames.filter(function (mn) {
                var isInclude = allModuleNames.includes(mn);
                if (!isInclude) {
                    console.warn("inject: " + mn + " module is not exits!");
                }
                return isInclude;
            });
            return { store: store, integralModulesName: integralModulesName };
        };
        Connect.prototype.render = function () {
            if (this.isUnmounted) {
                this.isUnmounted = false;
            }
            this.subscribe();
            var _a = this.props, forwardedRef = _a.forwardedRef, props = __rest(_a, ["forwardedRef"]);
            var newProps = Object.assign({}, props, {
                ref: forwardedRef,
            });
            if (!this.integralModulesName.length) {
                console.warn("modules: " + moduleNames.join() + " is not exits!");
                return react_1.default.createElement(WrappedComponent, __assign({}, newProps));
            }
            if (this.state.modulesHasLoaded === false) {
                return react_1.default.createElement(this.LoadingComponent, null);
            }
            var _b = this, store = _b.store, integralModulesName = _b.integralModulesName;
            this.injectModules = integralModulesName.reduce(function (res, mn) {
                res[mn] = store.getModule(mn);
                return res;
            }, {});
            Object.assign(newProps, this.injectModules);
            return react_1.default.createElement(WrappedComponent, __assign({}, newProps));
        };
        return Connect;
    }(react_1.default.Component));
    var FinalConnect = Connect;
    if (!!react_1.default.forwardRef) {
        FinalConnect = react_1.default.forwardRef(function ForwardConnect(props, ref) { return react_1.default.createElement(Connect, __assign({}, props, { forwardedRef: ref })); });
    }
    return (0, hoist_non_react_statics_1.default)(FinalConnect, WrappedComponent);
};
var createInject = function (_a) {
    var storeGetter = _a.storeGetter, _b = _a.loadingComponent, loadingComponent = _b === void 0 ? Loading : _b;
    function Inject() {
        var moduleDec = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            moduleDec[_i] = arguments[_i];
        }
        var depDecs = {};
        var moduleNames = moduleDec.map(function (m) {
            if ((0, injectCache_1.isModuleDepDec)(m)) {
                depDecs[m[0]] = m[1];
                return m[0];
            }
            return m;
        });
        var connectHOC = function (WrappedComponent, LoadingComponent) {
            if (LoadingComponent === void 0) { LoadingComponent = loadingComponent; }
            return connect(moduleNames, depDecs, storeGetter, WrappedComponent, LoadingComponent);
        };
        var type = null;
        connectHOC.type = type;
        connectHOC.watch = function watch(mn, dep) {
            if (moduleNames.includes(mn) && (0, injectCache_1.isModuleDepDec)([mn, dep])) {
                depDecs[mn] = dep;
            }
            return connectHOC;
        };
        return connectHOC;
    }
    Inject.setLoadingComponent = function (LoadingComponent) { return Loading = LoadingComponent; };
    return Inject;
};
exports.default = createInject;
