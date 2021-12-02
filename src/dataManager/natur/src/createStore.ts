/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:12:36
 * @modify date 2019-08-09 17:12:36
 * @desc [description]
 */
import { compose, isStoreModule } from "./utils";

import {
	GenerateStoreType,
	PickPromiseType,
	Modules,
	LazyStoreModules,
	Middleware,
	Store,
	StoreModule,
	Listener,
	MiddlewareNext,
	Actions,
	ModuleEvent,
	MiddlewareActionRecord,
	GlobalResetStatesOption,
	InjectMaps,
	InjectStoreModule,
	Action,
	PromiseModuleType,
	AllStates,
	Interceptor,
	InterceptorNext,
	PickedLazyStoreModules,
	PickLazyStoreModules,
} from "./ts-utils";

import MapCache from "./MapCache";

/**
 * 
 * @param modules 同步模块, 你的store模块
 * @param lazyModules 懒加载模块， 必填，如果没有可以传{}, 如果不填，那么ts的类型推断会有问题
 * @param param2 选项配置，详情见文档
 */
const createStore = <
M extends Modules,
LM extends LazyStoreModules,
>(
	modules: M = {} as any,
	lazyModules: LM,
	{
		initStates = {},
		middlewares = [],
		interceptors = [],
	}: {
		initStates?: Partial<
			{
				[k in keyof GenerateStoreType<M, LM>]: GenerateStoreType<
					M,
					LM
				>[k]["state"];
			}
		>,
		middlewares?: Middleware<GenerateStoreType<M, LM>>[],
		interceptors?: Interceptor<GenerateStoreType<M, LM>>[]
	} = {}
) => {
	// type ModuleName = keyof M | keyof LM;
	type ModuleName = string;
	const t = ({
		...modules,
		...lazyModules,
	})
	type AM = M &
		{
			[k in keyof LM]: PickPromiseType<LM[k]>;
		};
	type StoreType = GenerateStoreType<M, LM>;
	// type AS = Partial<{
	// 	[k in keyof StoreType]: StoreType[k]['state']
	// }>;
	type PS = Partial<
		{
			[k in keyof StoreType]: StoreType[k]["state"];
		}
	>;
	/**
	 * 存放store实例
	 */
	let currentStoreInstance: Store<M, LM>;
	/**
	 * 存放createStore构造函数传入的全局初始化state
	 */
	let currentInitStates = { ...initStates };
	/**
	 * 存放着每个模块最初的state数据
	 * 用于globalResetStates方法重置store中的所有state
	 */
	let resetStateData: PS = {};

	/**
	 * 用户调用globalSetStates时，有的模块可能是懒加载模块，还未加载好，
	 * 所以需要缓存好懒加载模块的state，等到setModule初始化了该模块，则会立即调用globalSetStates更新该模块的数据
	 */
	let globalSetStateCache: PS = {};
	/**
	 * 主要存放，已经加载的store的state，maps，actions
	 * 这里存放的是原始的maps，actions，并非经过代理后的maps和actions，或者说并非是natur使用者获取的maps和actions
	 */
	let currentModules: Partial<
		{
			[k in keyof StoreType]: StoreModule;
		}
	> = {};
	/**
	 * 懒加载模块配置
	 */
	let currentLazyModules = { ...lazyModules };
	/**
	 * 监听器对象
	 * key是模块的名字
	 * value是存放该模块对应的监听器的数组
	 * 在模块的state变更，模块的删除，初始化时，会通知对应的监听器
	 */
	let listeners: {
		[p: string]: Listener[]
	} = {};
	/**
	 * 存放所有模块的名字
	 */
	let allModuleNames: ModuleName[] | undefined;
	/**
	 * 存放createStore中传入的middlewares配置
	 */
	let currentMiddlewares = [...middlewares];
	let currentInterceptors = [...interceptors];
	/**
	 * 这是一个缓存，用于存放，每个模块对应的setState代理
	 * 在每个模块生成对应的action代理时，会产生一个setState的方法，
	 * 这个setState是用于改变对应模块的state的
	 * 同时这个setState会使用洋葱模型包装好middlewares，所以在调用setState时，会先调用middlewares
	 */
	const setStateProxyWithMiddlewareCache: {
		[moduleName: string]: MiddlewareNext
	} = {};
	/**
	 * 存放每个模块对应的actions代理缓存
	 * natur使用者获取的action并非原始的action，而是代理的action
	 * 代理action调用后可以经过中间件，然后将返回值作为新的state更新，并通知对应的监听器
	 * 在getModule中生成action代理是有性能消耗的，所以需要加一个缓存
	 * 那么保证action代理生成后，下一次getModule可以一直使用上一次生成过的action代理
	 * 所以你获取的action代理会一直相同，这在react的性能优化时也同样有用
	 */
	const actionsProxyCache: {
		[MN: string]: Actions;
	} = {};
	/**
	 * maps的缓存，在调用getModule时，会产生对应的maps计算结果
	 * 如果再次getModule时，判断state没有发生变化则使用上次生成的maps缓存，以此达到性能优化的目的
	 * 值得注意的是mapsCache第一层的key是模块名，第二层的key是模块对应的maps中的key
	 * 注意，这里的缓存使用的是MapCache这个对象的实例，
	 * MapCache主要用于maps的计算，和判断map的值是否需要重新计算还是使用缓存
	 */
	type MapCacheValue = {
		[mapName: string]: MapCache;
	};
	const mapsCache: {
		[moduleName: string]: MapCacheValue
	} = {};
	/**
	 * 与mapsCache一样是maps的缓存
	 * 但是数据结构不同，mapsCache第二层的key是模块对应的maps中的key，这里则是一个数组，方便做循环遍历使用
	 */
	const mapsCacheList: {
		[moduleName: string]: MapCache[]
	}= {};

	/**
	 * 此方法使用在setModule中，
	 * 使用createStore中的初始化的state，来替换待加载模块的state数据
	 * @param moduleName 模块名
	 * @param storeModule 待加载模块的原始数据
	 */
	const replaceModule = (moduleName: ModuleName, storeModule: StoreModule) => {
		let res;
		// 缓存每个模块的初始化状态，供globalResetStates使用
		resetStateData[moduleName as keyof StoreType] = storeModule.state;
		if (!!currentInitStates[moduleName as keyof StoreType]) {
			res = {
				...storeModule,
				state: currentInitStates[moduleName as keyof StoreType],
			};
			delete currentInitStates[moduleName as keyof StoreType];
		} else {
			res = { ...storeModule };
		}
		return res;
	};

	/**
	 * 查看该模块是否已经加载
	 * @param moduleName 模块名
	 */
	const hasModule = (moduleName: keyof StoreType) =>
		!!currentModules[moduleName as string];

	/**
	 * 查看该模块是否已经加载，如果没有则报错
	 * @param moduleName 模块名
	 */
	const checkModuleIsValid = (moduleName: keyof StoreType) => {
		if (!hasModule(moduleName)) {
			const errMsg = `module: ${moduleName} is not valid!`;
			// console.error(errMsg);
			throw new Error(errMsg);
		}
	};
	/**
	 * 删除一个模块的action proxy缓存
	 * @param moduleName 模块名
	 */
	const clearActionsProxyCache = (moduleName: ModuleName) => {
		delete actionsProxyCache[moduleName];
	}

	/**
	 * 删除一个模块的map proxy缓存
	 * @param moduleName 模块名
	 */
	const clearMapsProxyCache = (moduleName: ModuleName) => {
		delete mapsCache[moduleName];
		mapsCacheList[moduleName]!.forEach((i) => i.destroy());
		delete mapsCacheList[moduleName];
	};
	/**
	 * 当模块对应的state更新时，需要通知该模块的maps缓存，state已经改变
	 * 所以在下一次获取maps的值时，应该先看看maps的依赖有没有变化，
	 * @param moduleName 
	 */
	const mapsCacheShouldCheckForValid = (moduleName: ModuleName) => {
		mapsCacheList[moduleName]!.forEach((i) => i.shouldCheckCache());
	};

	/**
	 * 清除setStateProxyWithMiddlewareCache对应模块的缓存
	 * @param moduleName 
	 */
	const clearSetStateProxyWithMiddlewareCache = (moduleName: string) => {
		delete setStateProxyWithMiddlewareCache[moduleName];
	}
	/**
	 * 清除模块对应的一切缓存
	 * @param moduleName 模块名
	 */
	const clearAllCache = (moduleName: string) => {
		clearMapsProxyCache(moduleName);
		clearActionsProxyCache(moduleName);
		clearSetStateProxyWithMiddlewareCache(moduleName);
	};
	/**
	 * 获取所有模块的名字，包括懒加载模块的名字
	 */
	const getAllModuleName = () => {
		if (!allModuleNames) {
			allModuleNames = Object.keys({
				...currentModules,
				...currentLazyModules,
			});
		}
		return allModuleNames;
	};
	/**
	 * 模块发生变动，通知对应的监听器
	 * @param moduleName 
	 * @param me 模块变动的详情
	 */
	const runListeners = (moduleName: ModuleName, me: ModuleEvent) =>
		Array.isArray(listeners[moduleName]) &&
		listeners[moduleName]!.forEach((listener) => listener(me));
	
	/**
	 * 用于更新模块对应的state，并发出通知
	 * 通知模块监听器
	 * 通知模块中的maps缓存state更新了
	 * 如果新的state全等于旧的state则不会触发更新
	 * @param param0 
	 */
	const setState = ({
		moduleName,
		state: newState,
		actionName,
	}: MiddlewareActionRecord) => {
		const stateHasNoChange = currentModules[moduleName]!.state === newState;
		if (stateHasNoChange) {
			return newState;
		}
		currentModules[moduleName]!.state = newState;
		mapsCacheShouldCheckForValid(moduleName as string);
		runListeners(moduleName as string, {
			type: "update",
			actionName,
		});
		return currentModules[moduleName]!.state;
	};
	/**
	 * 全局统一设置state
	 * 主要的应用场景是，异步加载所有的state配置时，需要更新到对应的模块中
	 * 更新会走中间件，中间中的actionName参数是'globalSetStates'
	 * @param states 
	 */
	const globalSetStates = (states: PS) => {
		Object.keys(states).forEach((moduleName: ModuleName) => {
			if (hasModule(moduleName)) {
				if (!setStateProxyWithMiddlewareCache[moduleName]) {
					createDispatch(moduleName);
				}
				setStateProxyWithMiddlewareCache[moduleName]!({
					moduleName: moduleName as string,
					actionName: "globalSetStates",
					state: states[moduleName],
				});
			} else {
				globalSetStateCache[moduleName as keyof StoreType] =
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
	const globalResetStates = ({
		include,
		exclude,
	}: GlobalResetStatesOption = {}) => {
		let shouldResetModuleNames: ModuleName[] = Object.keys(
			resetStateData
		).filter(hasModule);
		if (exclude) {
			const stringExclude = exclude.filter(
				(ex) => typeof ex === "string"
			) as string[];
			const regExpExclude = exclude.filter(
				(ex) => typeof ex !== "string"
			) as RegExp[];
			// 过滤不需要重制状态的模块
			shouldResetModuleNames = shouldResetModuleNames.filter((mn) => {
				return (
					stringExclude.indexOf(mn as string) === -1 &&
					!regExpExclude.some((reg) => reg.test(mn as string))
				);
			});
		}
		if (include) {
			const stringInclude = include.filter(
				(ex) => typeof ex === "string"
			) as string[];
			const regExpInclude = include.filter(
				(ex) => typeof ex !== "string"
			) as RegExp[];
			// 如果存在include配置，则只重制include配置中的模块
			shouldResetModuleNames = shouldResetModuleNames.filter(mn => {
				return (
					stringInclude.indexOf(mn as string) > -1 ||
					regExpInclude.some((reg) => reg.test(mn as string))
				);
			});
		}
		shouldResetModuleNames.forEach((mn) => {
			if (!setStateProxyWithMiddlewareCache[mn]) {
				createDispatch(mn);
			}
			setStateProxyWithMiddlewareCache[mn]!({
				moduleName: mn as string,
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
	const setModule = (moduleName: ModuleName, storeModule: StoreModule) => {
		if (!isStoreModule(storeModule)) {
			const errMsg = `setModule: storeModule ${moduleName} is illegal!`;
			// console.error(errMsg);
			throw new Error(errMsg);
		}
		const isModuleExist = hasModule(moduleName as keyof StoreType);
		currentModules = {
			...currentModules,
			[moduleName]: replaceModule(moduleName, storeModule),
		};
		if (isModuleExist) {
			clearAllCache(moduleName as string);
		} else {
			allModuleNames = undefined;
		}
		if (!mapsCache[moduleName]) {
			mapsCache[moduleName] = {} as any;
			mapsCacheList[moduleName] = [] as any;
		}
		runListeners(moduleName, { type: "init" });
		if(moduleName in globalSetStateCache) {
			const s = globalSetStateCache[moduleName];
			delete globalSetStateCache[moduleName];
			globalSetStates({
				[moduleName]: s,
			} as PS);
		}
		return currentStoreInstance;
	};
	/**
	 * 销毁模块，清空缓存以及对应的原始数据
	 * @param moduleName 
	 */
	const destroyModule = (moduleName: string) => {
		delete currentModules[moduleName];
		delete (currentLazyModules as LazyStoreModules)[moduleName];
		allModuleNames = undefined;
		clearAllCache(moduleName);
	};
	/**
	 * 移除模块，会调用destroyModule，并发送通知
	 * @param moduleName 
	 */
	const removeModule = (moduleName: string) => {
		destroyModule(moduleName);
		runListeners(moduleName, { type: "remove" });
		return currentStoreInstance;
	};
	/**
	 * 设置懒加载模块
	 * @param moduleName 
	 * @param lazyModule 
	 */
	const setLazyModule = (
		moduleName: keyof LM,
		lazyModule: () => Promise<StoreModule>
	) => {
		allModuleNames = undefined;
		(currentLazyModules as LM)[moduleName] = lazyModule as any;
		return currentStoreInstance;
	};
	/**
	 * 移除懒加载模块
	 * @param moduleName 
	 */
	const removeLazyModule = (moduleName: string) => {
		allModuleNames = undefined;
		delete (currentLazyModules as LazyStoreModules)[moduleName];
		return currentStoreInstance;
	};

	/**
	 * 计算maps的值，如果首次获取maps则会先建立缓存对象
	 * @param moduleName 
	 */
	const createMapsProxy = (
		moduleName: ModuleName
	): InjectMaps | undefined => {
		const { maps } = currentModules[moduleName]!;
		if (maps === undefined) {
			return undefined;
		}
		let proxyMaps: { [p: string]: any } = {};
		for (let key in maps) {
			if (maps.hasOwnProperty(key)) {
				if (mapsCache[moduleName]![key] === undefined) {
					const targetMap = maps[key];
					let mapCacheSecondParam: (string | Function)[] = [];
					if (Array.isArray(targetMap)) {
						mapCacheSecondParam = targetMap;
					} else if (targetMap.length !== 0) {
						mapCacheSecondParam = [
							() => currentModules[moduleName]!.state,
							targetMap,
						];
					} else {
						mapCacheSecondParam = [() => undefined, targetMap];
					}
					(mapsCache[moduleName] as MapCacheValue)[key] = new MapCache(
						() => currentModules[moduleName]!.state,
						mapCacheSecondParam
					);
					mapsCacheList[moduleName]!.push(mapsCache[moduleName]![key]);
				}
				const targetWatcher = mapsCache[moduleName]![key];
				proxyMaps[key] = targetWatcher.getValue();
			}
		}
		return proxyMaps;
	};
	/**
	 * 创建action代理
	 * @param moduleName 
	 */
	const createActionsProxy = (moduleName: ModuleName) => {
		if (!!actionsProxyCache[moduleName]) {
			return actionsProxyCache[moduleName];
		}
		let actionsProxy = { ...currentModules[moduleName]!.actions };
		const dispatch = createDispatch(moduleName);
		Object.keys(actionsProxy).forEach(
			(key) =>
				(actionsProxy[key] = (...data: any[]) => dispatch(key, ...data))
		);
		actionsProxyCache[moduleName] = actionsProxy as any;
		return actionsProxy;
	};
	/**
	 * 获取module
	 * @param moduleName 
	 */
	const getModule = <MN extends keyof StoreType>(moduleName: MN) => {
		checkModuleIsValid(moduleName);
		const proxyModule: StoreType[MN] = {
			state: currentModules[moduleName]!.state,
			actions: createActionsProxy(moduleName as string),
			maps: createMapsProxy(moduleName as string),
		} as any;
		return proxyModule;
	};
	/**
	 * 执行对应模块对应的action
	 * @param moduleName
	 * @param actionName
	 */
	const dispatch = <
		MN extends keyof StoreType,
		AN extends keyof StoreType[MN]["actions"]
	>(
		moduleName: MN,
		actionName: AN,
		...arg: Parameters<StoreType[MN]["actions"][AN]>
	): ReturnType<StoreType[MN]["actions"][AN]> => {
		if (hasModule(moduleName)) {
			const moduleProxyActions = createActionsProxy(moduleName as string);
			if (actionName in moduleProxyActions!) {
				return moduleProxyActions![actionName as string](...arg);
			}
		}
		return undefined as any;
	};
	/**
	 * 获取原始的module数据
	 * @param moduleName 
	 */
	const getOriginModule = (moduleName: ModuleName) => {
		checkModuleIsValid(moduleName);
		return currentModules[moduleName];
	};
	/**
	 * 获取某个懒加载模块
	 * @param moduleName 
	 */
	const getLazyModule = (moduleName: keyof LM) => {
		if (!!(currentLazyModules as LM)[moduleName]) {
			return (currentLazyModules as LM)[moduleName];
		}
		const errMsg = `getLazyModule: ${moduleName} is not exist`;
		// console.error(errMsg);
		throw new Error(errMsg);
	};
	/**
	 * 加载某个懒加载模块，如果已经加载就返回以及加载的模块
	 * @param moduleName 
	 */
	const loadModule = (moduleName: ModuleName): Promise<InjectStoreModule> => {
		if (hasModule(moduleName)) {
			return Promise.resolve(getModule(moduleName));
		}
		return getLazyModule(moduleName)().then((loadedModule) => {
			if (isStoreModule(loadedModule)) {
				setModule(moduleName, loadedModule);
			} else if(isStoreModule(loadedModule.default)) {
				setModule(moduleName, loadedModule.default);
			}
			return getModule(moduleName);
		});
	};

	const runAcion = ({
		moduleName,
		actionName,
		actionArgs,
	}: {
		moduleName: ModuleName;
		actionName: string;
		actionArgs: any[];
	}) => {
		checkModuleIsValid(moduleName);
		const targetModule = currentModules[moduleName]!;
		return targetModule.actions[actionName](...actionArgs);
	}
	/**
	 * 创建dispath
	 * 这里是拼接filter，action，middleware，setState的地方
	 * @param moduleName 
	 */
	const createDispatch = (moduleName: ModuleName): Action => {
		checkModuleIsValid(moduleName);
		const middlewareParams = {
			setState,
			getState: () => currentModules[moduleName]!.state,
			getMaps: () => createMapsProxy(moduleName),
			dispatch,
		};
		const middlewareChain = currentMiddlewares.map(
			(middleware: Middleware<StoreType>) =>
				middleware(middlewareParams)
		);
		const setStateProxyWithMiddleware = (compose<[MiddlewareNext], MiddlewareNext>(...middlewareChain))(setState);

		const filterChain = currentInterceptors.map(
			(middleware: Interceptor<StoreType>) =>
				middleware(middlewareParams)
		);
		const runActionProxyWithInterceptors = (compose<[InterceptorNext], InterceptorNext>(...filterChain))(
			filterRecord => {
				return setStateProxyWithMiddleware({
					moduleName,
					actionName: filterRecord.actionName,
					state: runAcion(filterRecord),
				});
			}
		);
		
		setStateProxyWithMiddlewareCache[moduleName] = setStateProxyWithMiddleware;

		return (actionName: string, ...actionArgs: any[]) => runActionProxyWithInterceptors({
			moduleName,
			actionName,
			actionArgs,
			actionFunc: currentModules[moduleName]!['actions'][actionName],
		});
	};
	/**
	 * 监听某个模块
	 * @param moduleName 
	 * @param listener 
	 */
	const subscribe = (moduleName: ModuleName, listener: Listener) => {
		if (!listeners[moduleName]) {
			listeners[moduleName] = [] as any;
		}
		listeners[moduleName]!.push(listener);
		return () => {
			if (Array.isArray(listeners[moduleName])) {
				listeners[moduleName] = listeners[moduleName]!.filter(
					(lis: Listener) => listener !== lis
				) as any;
			}
		};
	};
	/**
	 * 销毁store
	 */
	const destroy = () => {
		Object.keys(currentModules).forEach(destroyModule);
		currentInitStates = {};
		currentLazyModules = {} as any;
		listeners = {};
		allModuleNames = undefined;
		currentMiddlewares = [];
		currentInterceptors = [];
	};
	/**
	 * 初始化store
	 */
	const init = () => {
		Object.keys(modules).forEach((moduleName) => {
			setModule(moduleName, modules[moduleName as keyof M] as any);
		});
	};

	/**
	 * 获取所有state
	 * key是模块名
	 * value是模块对应的值
	 */
	const getAllStates = () => {
		return Object.keys(currentModules).reduce((as, key: keyof M | keyof LM) => {
			as[key] = currentModules[key]!.state;
			return as;
		}, {} as AllStates<M, LM>);
	};

	init();

	currentStoreInstance = {
		getAllModuleName,
		getModule,
		getOriginModule,
		getLazyModule,
		loadModule,
		setModule,
		removeModule,
		hasModule,
		setLazyModule,
		removeLazyModule,
		subscribe,
		destroy,
		dispatch,
		globalSetStates,
		globalResetStates,
		getAllStates,
		type: (null as any) as StoreType,
	} as any;
	return currentStoreInstance;
};
export default createStore;
