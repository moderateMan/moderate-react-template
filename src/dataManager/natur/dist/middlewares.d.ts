import { Middleware, Maps } from './ts-utils';
import { GenMapsType } from './ts-utils';
/**
 * S state的类型
 * M maps的类型
 */
export declare type ThunkParams<S = any, M extends Maps = any> = {
    getState: () => S;
    setState: (s: Partial<S>) => S;
    getMaps: () => GenMapsType<M, S>;
    dispatch: (moduleNameAndActionName: string, ...params: any) => any;
};
export declare const thunkMiddleware: Middleware<any>;
export declare const promiseMiddleware: Middleware<any>;
export declare const filterNonObjectMiddleware: Middleware<any>;
export declare const shallowEqualMiddleware: Middleware<any>;
export declare const fillObjectRestDataMiddleware: Middleware<any>;
export declare const filterUndefinedMiddleware: Middleware<any>;
