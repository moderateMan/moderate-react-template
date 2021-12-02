"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMapDepParser = exports.setMapDepParser = exports.createStore = exports.createInject = void 0;
/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:12:57
 * @modify date 2019-08-09 17:12:57
 * @desc [description]
 */
var MapCache_1 = __importDefault(require("./MapCache"));
var inject_1 = require("./inject");
Object.defineProperty(exports, "createInject", { enumerable: true, get: function () { return __importDefault(inject_1).default; } });
var createStore_1 = require("./createStore");
Object.defineProperty(exports, "createStore", { enumerable: true, get: function () { return __importDefault(createStore_1).default; } });
exports.setMapDepParser = MapCache_1.default.setMapDepParser;
exports.resetMapDepParser = MapCache_1.default.resetMapDepParser;
