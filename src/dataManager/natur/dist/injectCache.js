"use strict";
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
exports.initDiff = exports.isModuleDepDec = void 0;
var MapCache_1 = __importDefault(require("./MapCache"));
var isModuleDepDec = function (obj) {
    if (Array.isArray(obj) && obj.length === 2) {
        if (typeof obj[0] !== 'string') {
            return false;
        }
        if (obj[1].state && !Array.isArray(obj[1].state)) {
            return false;
        }
        if (obj[1].maps && !Array.isArray(obj[1].maps)) {
            return false;
        }
        return true;
    }
    return false;
};
exports.isModuleDepDec = isModuleDepDec;
var initDiff = function (moduleDepDec, store) {
    var diff = {};
    var _loop_1 = function (moduleName) {
        if (moduleDepDec.hasOwnProperty(moduleName)) {
            diff[moduleName] = [];
            if (moduleDepDec[moduleName].state) {
                var stateCache = new MapCache_1.default(function () { return store.getModule(moduleName).state; }, __spreadArray(__spreadArray([], moduleDepDec[moduleName].state, true), [function () { }], false));
                stateCache.hasDepChanged();
                diff[moduleName].push(stateCache);
            }
            if (moduleDepDec[moduleName].maps) {
                var mapsCache = new MapCache_1.default(function () { return store.getModule(moduleName).maps; }, __spreadArray(__spreadArray([], moduleDepDec[moduleName].maps, true), [function () { }], false));
                mapsCache.hasDepChanged();
                diff[moduleName].push(mapsCache);
            }
        }
    };
    for (var moduleName in moduleDepDec) {
        _loop_1(moduleName);
    }
    var destroy = function () {
        for (var moduleName in diff) {
            diff[moduleName].forEach(function (cache) { return cache.destroy(); });
            diff[moduleName] = [];
        }
        diff = {};
    };
    return {
        diff: diff,
        destroy: destroy,
    };
};
exports.initDiff = initDiff;
