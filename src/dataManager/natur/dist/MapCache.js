"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var MapCache = /** @class */ (function () {
    function MapCache(getState, map) {
        var _this = this;
        this.mapDepends = [];
        this.depCache = [];
        this.shouldCheckDependsCache = true;
        this.getState = getState;
        var copyMap = map.slice();
        this.map = copyMap.pop();
        copyMap.forEach(function (item) { return _this.mapDepends.push(_this.createGetDepByKeyPath(item)); });
    }
    MapCache.resetMapDepParser = function () {
        MapCache.getValueFromState = utils_1.getValueFromObjByKeyPath;
    };
    MapCache.setMapDepParser = function (parser) {
        MapCache.getValueFromState = parser;
    };
    MapCache.prototype.createGetDepByKeyPath = function (keyPath) {
        if (typeof keyPath !== 'function') {
            return function (s) {
                return MapCache.getValueFromState(s, keyPath);
            };
        }
        return keyPath;
    };
    MapCache.prototype.shouldCheckCache = function () {
        this.shouldCheckDependsCache = true;
    };
    MapCache.prototype.getDepsValue = function () {
        var _this = this;
        return this.mapDepends.map(function (dep) { return dep(_this.getState()); });
    };
    MapCache.prototype.hasDepChanged = function () {
        if (this.shouldCheckDependsCache) {
            var newDepCache = this.getDepsValue();
            var depHasChanged = !(0, utils_1.arrayIsEqual)(this.depCache, newDepCache);
            if (depHasChanged) {
                this.depCache = newDepCache;
            }
            this.shouldCheckDependsCache = false;
            return depHasChanged;
        }
        return false;
    };
    MapCache.prototype.getValue = function () {
        if (this.hasDepChanged()) {
            this.value = this.map.apply(this, this.depCache);
        }
        return this.value;
    };
    MapCache.prototype.destroy = function () {
        this.map = function () { };
        this.mapDepends = [];
        this.depCache = [];
        this.getState = function () { return ({}); };
    };
    MapCache.getValueFromState = utils_1.getValueFromObjByKeyPath;
    return MapCache;
}());
exports.default = MapCache;
