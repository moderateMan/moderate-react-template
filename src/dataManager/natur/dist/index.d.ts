/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:12:57
 * @modify date 2019-08-09 17:12:57
 * @desc [description]
 */
import MapCache from './MapCache';
export { default as createInject } from "./inject";
export { default as createStore, } from "./createStore";
export { ModuleEvent, Listener, State, States, Action, Actions, StoreMap, Maps, InjectMaps, StoreModule, InjectStoreModule, InjectStoreModules, LazyStoreModules, Modules, GlobalResetStatesOption, ModuleName, MiddlewareActionRecord, MiddlewareNext, MiddlewareParams, Middleware, InterceptorActionRecord, InterceptorNext, InterceptorParams, Interceptor, Store, ModuleType, GenMapsType, GenActionsType, GenerateStoreType, } from './ts-utils';
export { ThunkParams } from './middlewares';
export declare const setMapDepParser: typeof MapCache.setMapDepParser;
export declare const resetMapDepParser: typeof MapCache.resetMapDepParser;
