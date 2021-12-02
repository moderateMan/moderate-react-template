export declare type ModuleEvent<AN extends string = string> = {
    type: 'init' | 'update' | 'remove';
    actionName?: AN | 'globalSetStates' | 'globalResetStates';
};
export interface Listener<AN extends string = string> {
    (me: ModuleEvent<AN>): any;
}
export declare type State = any;
export declare type AnyFun = (...arg: any) => any;
export interface States {
    [type: string]: State;
}
export interface Action {
    (...arg: any[]): any;
}
export interface Actions {
    [type: string]: Action;
}
export declare type StoreMap = Array<string | AnyFun> | AnyFun;
export interface Maps {
    [p: string]: StoreMap;
}
export interface InjectMaps {
    [p: string]: any;
}
export interface StoreModule {
    state: State;
    actions: Actions;
    maps?: Maps;
}
export interface InjectStoreModule {
    state: State;
    actions: Actions;
    maps?: any;
}
export declare type InjectStoreModules = {
    [k: string]: InjectStoreModule;
};
export interface LazyStoreModules {
    [p: string]: () => Promise<StoreModule | {
        default: StoreModule;
    }>;
}
export interface Modules {
    [p: string]: StoreModule;
}
export declare type MiddlewareActionRecord = {
    moduleName: string;
    actionName: string;
    state: ReturnType<Action>;
};
export declare type MiddlewareNext = (record: MiddlewareActionRecord) => ReturnType<Action>;
export declare type MiddlewareParams<StoreType extends InjectStoreModules> = {
    setState: MiddlewareNext;
    getState: () => State;
    getMaps: () => InjectMaps | undefined;
    dispatch: <MN extends keyof StoreType, AN extends keyof StoreType[MN]['actions']>(moduleName: MN, actionName: AN, ...arg: Parameters<StoreType[MN]['actions'][AN]>) => ReturnType<StoreType[MN]['actions'][AN]>;
};
export declare type GlobalResetStatesOption<MN extends string = string> = {
    include?: Array<MN | RegExp>;
    exclude?: Array<MN | RegExp>;
};
export declare type ModuleName<M, LM> = keyof M | keyof LM;
export declare type Middleware<StoreType extends {
    [k: string]: InjectStoreModule;
}> = (middlewareParams: MiddlewareParams<StoreType>) => (next: MiddlewareNext) => MiddlewareNext;
export declare type InterceptorActionRecord = {
    moduleName: string;
    actionName: string;
    actionArgs: Parameters<Action>;
    actionFunc: AnyFun;
};
export declare type InterceptorNext = (record: InterceptorActionRecord) => ReturnType<Action>;
export declare type InterceptorParams<StoreType extends InjectStoreModules> = {
    setState: MiddlewareNext;
    getState: () => State;
    getMaps: () => InjectMaps | undefined;
    dispatch: <MN extends keyof StoreType, AN extends keyof StoreType[MN]['actions']>(moduleName: MN, actionName: AN, ...arg: Parameters<StoreType[MN]['actions'][AN]>) => ReturnType<StoreType[MN]['actions'][AN]>;
};
export declare type Interceptor<StoreType extends {
    [k: string]: InjectStoreModule;
}> = (filterParams: InterceptorParams<StoreType>) => (next: InterceptorNext) => InterceptorNext;
declare type Fn<T extends Array<any>, S extends any> = (...arg: T) => S;
declare type ActionArg<Action extends AnyFun> = Parameters<Action>;
/**
 * 如果action返回值是一个函数，那么返回 返回函数 的返回值
 */
declare type ActionActualReturnType<Action extends AnyFun> = (ReturnType<Action> extends AnyFun ? ReturnType<ReturnType<Action>> : ReturnType<Action>);
/**
 * 将actions的返回值中的Partial<state>替换为state
 */
declare type ReplacePartialStateToState<ART, S, PS = Partial<S>> = Extract<ART, PS | Promise<PS>> extends never ? ART : Extract<ART, PS | Promise<PS>> extends PS ? (Exclude<ART, PS> | S) : Extract<ART, PS | Promise<PS>> extends Promise<PS> ? (Exclude<ART, Promise<PS>> | Promise<S>) : Extract<ART, PS | Promise<PS>> extends (Promise<PS> | PS) ? (Exclude<ART, (Promise<PS> | PS)> | Promise<S> | S) : ART;
/**
 * 生成action方法的返回值
 */
declare type ActionReturnType<Action extends AnyFun, S extends any> = ReplacePartialStateToState<ActionActualReturnType<Action>, S>;
/**
 * 生成actions类型
 */
export declare type GenActionsType<OAS extends {
    [m: string]: AnyFun;
}, S> = {
    [a in keyof OAS]: Fn<ActionArg<OAS[a]>, ActionReturnType<OAS[a], S>>;
};
declare type ExcludeStateGetterDep<MapItem, StateGetterDep> = MapItem extends StateGetterDep ? (StateGetterDep extends MapItem ? never : MapItem) : MapItem;
declare type MapsFunType<M extends Maps, S extends StoreModule['state']> = {
    [k in keyof M]: M[k] extends Array<any> ? ExcludeStateGetterDep<Extract<M[k][0], AnyFun>, (s: S) => any> : M[k] extends AnyFun ? M[k] : never;
};
declare type MapsFun = {
    [m: string]: AnyFun;
};
declare type MapsReturnType<MF extends MapsFun> = {
    [k in keyof MF]: ReturnType<MF[k]>;
};
/**
 * 生成maps类型
 */
export declare type GenMapsType<M extends Maps, S extends StoreModule['state']> = MapsReturnType<MapsFunType<M, S>>;
declare type StoreModuleWithMaps = {
    state: StoreModule['state'];
    actions: StoreModule['actions'];
    maps: Maps;
};
declare type StoreModuleWithoutMaps = {
    state: StoreModule['state'];
    actions: StoreModule['actions'];
};
/**
 * 删除了default的懒加载类型
 */
export interface PickedLazyStoreModules {
    [p: string]: () => Promise<StoreModule>;
}
/**
 * 将懒加载类型计算为于同步类型相同的类型
 */
export declare type PickLazyStoreModules<LMS extends LazyStoreModules> = {
    [p in keyof LMS]: LMS[p] extends () => Promise<infer V> ? V extends StoreModule ? Omit<V, 'default'> : V extends {
        default: StoreModule;
    } ? V['default'] : never : never;
};
/**
 * 生成模块类型
 */
export declare type ModuleType<M extends StoreModule> = {
    [m in keyof M]: m extends 'state' ? M['state'] : (m extends 'actions' ? GenActionsType<M['actions'], M['state']> : (m extends 'maps' ? (M extends StoreModuleWithMaps ? GenMapsType<M['maps'], M['state']> : undefined) : never));
};
/**
 * 获取promise值的类型
 */
export declare type PickPromiseType<P extends () => Promise<any>> = P extends () => Promise<infer V> ? V : never;
/**
 * 生成懒加载模块的类型
 */
export declare type PromiseModuleType<PM extends () => Promise<StoreModuleWithMaps | StoreModuleWithoutMaps>, M extends StoreModuleWithMaps | StoreModuleWithoutMaps = PickPromiseType<PM>> = {
    [m in keyof M]: m extends 'state' ? M['state'] : (m extends 'actions' ? GenActionsType<M['actions'], M['state']> : (m extends 'maps' ? (M extends StoreModuleWithMaps ? GenMapsType<M['maps'], M['state']> : undefined) : never));
};
/**
 * 生成StoreType
 * key是模块和懒加载模块的名字
 * value是模块和懒加载模块对应的{state, actions, maps}对象
 */
export declare type GenerateStoreType<MS extends Modules, _LM extends LazyStoreModules, PMS extends Modules = PickLazyStoreModules<_LM>> = {
    [k in keyof MS]: ModuleType<MS[k]>;
} & {
    [k in keyof PMS]: ModuleType<PMS[k]>;
};
export declare type AllStates<M extends Modules, _LM extends LazyStoreModules, LM extends Modules = PickLazyStoreModules<_LM>> = {
    [KM in keyof M]: M[KM]['state'];
} & {
    [KM in keyof LM]?: LM[KM]['state'];
};
/**
 * 生成store类型
 */
export interface Store<M extends Modules, LM extends LazyStoreModules, StoreType extends InjectStoreModules = GenerateStoreType<M, LM>, AOST extends Modules = (M & {
    [k in keyof LM]: PickLazyStoreModules<LM>[k];
}), S = AllStates<M, LM>> {
    getModule: <MN extends keyof StoreType>(moduleName: MN) => StoreType[MN];
    setModule: <MN extends keyof AOST>(moduleName: MN, storeModule: AOST[MN]) => Store<M, LM>;
    removeModule: (moduleName: ModuleName<M, LM>) => Store<M, LM>;
    setLazyModule: (moduleName: ModuleName<M, LM>, lazyModule: () => Promise<StoreModule>) => Store<M, LM>;
    removeLazyModule: (moduleName: ModuleName<M, LM>) => Store<M, LM>;
    hasModule: (moduleName: ModuleName<M, LM>) => boolean;
    loadModule: <MN extends keyof LM>(moduleName: MN) => Promise<PickLazyStoreModules<LM>[MN]>;
    getOriginModule: <MN extends keyof AOST>(moduleName: MN) => AOST[MN];
    getLazyModule: (moduleName: ModuleName<{}, LM>) => () => Promise<StoreModule>;
    subscribe: <MN extends keyof AOST>(moduleName: MN, listener: Listener<Extract<keyof AOST[MN]['actions'], string>>) => () => void;
    getAllModuleName: () => (keyof StoreType)[];
    destroy: () => void;
    dispatch: <MN extends keyof StoreType, AN extends keyof StoreType[MN]['actions']>(moduleName: MN, actionName: AN, ...arg: Parameters<StoreType[MN]['actions'][AN]>) => ReturnType<StoreType[MN]['actions'][AN]>;
    globalSetStates: (s: Partial<S>) => void;
    globalResetStates: <MN extends keyof StoreType>(option?: GlobalResetStatesOption<Extract<MN, string>>) => void;
    getAllStates: () => AllStates<M, LM>;
    type: StoreType;
}
export {};
