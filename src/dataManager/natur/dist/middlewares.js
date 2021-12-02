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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterUndefinedMiddleware = exports.fillObjectRestDataMiddleware = exports.shallowEqualMiddleware = exports.filterNonObjectMiddleware = exports.promiseMiddleware = exports.thunkMiddleware = void 0;
var utils_1 = require("./utils");
var thunkMiddleware = function (_a) {
    var getState = _a.getState, getMaps = _a.getMaps, dispatch = _a.dispatch;
    return function (next) { return function (record) {
        if (typeof record.state === 'function') {
            var setState = function (s) { return next(__assign(__assign({}, record), { state: s })); };
            var _dispatch = function (action) {
                var arg = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    arg[_i - 1] = arguments[_i];
                }
                if (/^\w+\/\w+$/.test(action)) {
                    var moduleName = action.split('/')[0];
                    var actionName = action.split('/').slice(1).join('/');
                    return dispatch.apply(void 0, __spreadArray([moduleName, actionName], arg, false));
                }
                return dispatch.apply(void 0, __spreadArray([record.moduleName, action], arg, false));
            };
            return next(__assign(__assign({}, record), { state: record.state({ getState: getState, setState: setState, getMaps: getMaps, dispatch: _dispatch }) }));
        }
        return next(record);
    }; };
};
exports.thunkMiddleware = thunkMiddleware;
var promiseMiddleware = function () { return function (next) { return function (record) {
    if ((0, utils_1.isPromise)(record.state)) {
        return record.state
            .then(function (ns) { return next(__assign(__assign({}, record), { state: ns })); });
    }
    return next(record);
}; }; };
exports.promiseMiddleware = promiseMiddleware;
var filterNonObjectMiddleware = function () { return function (next) { return function (record) {
    if (!(0, utils_1.isObj)(record.state)) {
        return record.state;
    }
    return next(record);
}; }; };
exports.filterNonObjectMiddleware = filterNonObjectMiddleware;
var shallowEqualMiddleware = function (_a) {
    var getState = _a.getState;
    return function (next) { return function (record) {
        var oldState = getState();
        if ((0, utils_1.isEqualWithDepthLimit)(record.state, oldState, 1)) {
            return record.state;
        }
        return next(record);
    }; };
};
exports.shallowEqualMiddleware = shallowEqualMiddleware;
var fillObjectRestDataMiddleware = function (_a) {
    var getState = _a.getState;
    return function (next) { return function (record) {
        var currentState = getState();
        if ((0, utils_1.isObj)(record.state) && (0, utils_1.isObj)(currentState)) {
            record = Object.assign({}, record, {
                state: Object.assign({}, currentState, record.state)
            });
        }
        return next(record);
    }; };
};
exports.fillObjectRestDataMiddleware = fillObjectRestDataMiddleware;
var filterUndefinedMiddleware = function () { return function (next) { return function (record) {
    if (record.state === undefined) {
        return undefined;
    }
    return next(record);
}; }; };
exports.filterUndefinedMiddleware = filterUndefinedMiddleware;
