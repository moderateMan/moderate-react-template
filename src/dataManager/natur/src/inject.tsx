/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:03
 * @modify date 2019-08-09 17:13:03
 * @desc [description]
 */
 import React from 'react';
 import hoistStatics from 'hoist-non-react-statics'
 import {
	 // ModuleName,
	 Store,
	 Modules,
	 InjectStoreModules, LazyStoreModules, GenerateStoreType, PickLazyStoreModules
 } from './ts-utils';
 import {isEqualWithDepthLimit} from './utils';
 import {ModuleDepDec, isModuleDepDec, DepDecs, Diff, initDiff} from './injectCache';
 
 type TReactComponent<P> = React.FC<P> | React.ComponentClass<P>;
 type ModuleName = string;
 type ModuleNames = ModuleName[];
 
 let Loading: TReactComponent<{}> = () => null;
 
 type Tstate = {
	 storeStateChange: {},
	 modulesHasLoaded: boolean,
 }
 
 export type StoreGetter<M extends Modules, LM extends LazyStoreModules> = () => Store<M, LM>;
 
 type ConnectReturn<P, SP> = React.ComponentClass<Omit<P, keyof SP> & { forwardedRef?: React.Ref<any> }>
 
 const connect = <P, SP, M extends Modules, LM extends LazyStoreModules>(
	 moduleNames: Array<ModuleName>,
	 depDecs: DepDecs,
	 storeGetter: StoreGetter<M, LM>,
	 WrappedComponent: TReactComponent<P>,
	 LoadingComponent?: TReactComponent<any>,
 ): ConnectReturn<P, SP> => {
	 type ConnectProps = P & { forwardedRef: React.Ref<any> };
 
	 class Connect extends React.Component<ConnectProps> {
		 private store: Store<M, LM>;
		 private integralModulesName: ModuleNames;
		 private unLoadedModules: ModuleNames;
		 private injectModules: Modules = {};
		 private unsubStore: () => void = () => { };
		 private LoadingComponent: TReactComponent<{}>;
		 private storeModuleDiff: Diff | undefined;
		 private destroyCache: Function = () => {};
		 private isSubscribing = false;
		 /**
		  * 组件还未渲染
		  */
		 private isUnmounted = true;
		 state: Tstate = {
			 storeStateChange: {},
			 modulesHasLoaded: false,
		 }
		 constructor(props: ConnectProps) {
			 super(props);
			 // 初始化store, integralModulesName(合法模块名)
			 const { store, integralModulesName } = this.init();
			 this.store = store;
			 this.integralModulesName = integralModulesName;
			 const unLoadedModules = integralModulesName.filter(mn => !store.hasModule(mn));
			 this.unLoadedModules = unLoadedModules;
			 // 初始化模块是否全部加载完成标记
			 this.state.modulesHasLoaded = !unLoadedModules.length;
			 this.setStoreStateChanged = this.setStoreStateChanged.bind(this);
			 this.LoadingComponent = LoadingComponent || Loading;
			 this.loadLazyModule();
		 }
		 loadLazyModule() {
			 const {
				 store,
				 unLoadedModules,
			 } = this;
			 const { modulesHasLoaded } = this.state;
			 
			 if (!modulesHasLoaded) {
				 Promise.all(
					 unLoadedModules.map(mn => store.loadModule(mn))
				 )
				 .then(() => {
					 if (this.isUnmounted === false) {
						 this.setState({
							 modulesHasLoaded: true,
						 })
					 } else {
						 this.state.modulesHasLoaded = true;
					 }
				 })
				 .catch(() => {
					 if (this.isUnmounted === false) {
						 this.setState({
							 modulesHasLoaded: false,
						 })
					 } else {
						 this.state.modulesHasLoaded = true;
					 }
				 });
			 }
		 }
		 subscribe() {
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
		 }
		 unsubscribe() {
			 this.unsubStore();
			 this.destroyCache();
			 this.unsubStore = () => {};
			 this.destroyCache = () => {};
			 this.isSubscribing = false;
			 this.isUnmounted = true;
		 }
		 setStoreStateChanged(moduleName: ModuleName) {
			 if (!depDecs[moduleName]) {
				 this.setState({
					 storeStateChange: {},
				 });
			 } else if(this.storeModuleDiff) {
				 let hasDepChanged = false;
				 this.storeModuleDiff[moduleName].forEach(diff => {
					 diff.shouldCheckCache();
					 if (diff.hasDepChanged()) {
						 hasDepChanged = true;
					 }
				 });
				 if (hasDepChanged) {
					 this.setState({
						 storeStateChange: {},
					 });
				 }
			 } else {
				 this.setState({
					 storeStateChange: {},
				 });
			 }
		 }
		 initDiff(moduleDepDec: DepDecs = depDecs, store: Store<M, LM> = this.store):void {
			 const {diff, destroy} = initDiff(moduleDepDec, store);
			 this.storeModuleDiff = diff;
			 this.destroyCache = destroy;
		 }
		 initStoreListner() {
			 const {
				 store,
				 integralModulesName,
				 setStoreStateChanged
			 } = this;
			 const unsubscribes = integralModulesName.map(mn => store.subscribe(mn, () => setStoreStateChanged(mn)));
			 this.unsubStore = () => unsubscribes.forEach(fn => fn());
		 }
		 componentWillUnmount() {
			 this.unsubscribe();
		 }
		 shouldComponentUpdate(nextProps: ConnectProps, nextState: Tstate) {
			 const propsChanged = !isEqualWithDepthLimit(this.props, nextProps, 1);
			 const stateChanged = nextState.modulesHasLoaded !== this.state.modulesHasLoaded || nextState.storeStateChange !== this.state.storeStateChange;
			 return propsChanged || stateChanged;
		 }
		 init() {
			 const store = storeGetter();
			 
			 const allModuleNames = store.getAllModuleName();
			 // 获取store中存在的模块
			 const integralModulesName = moduleNames.filter(mn => {
				 const isInclude = allModuleNames.includes(mn);
				 if (!isInclude) {
					 console.warn(`inject: ${mn} module is not exits!`);
				 }
				 return isInclude;
			 });
			 return { store, integralModulesName };
		 }
		 render() {
			 if (this.isUnmounted) {
				 this.isUnmounted = false;
			 }
			 this.subscribe();
			 const { forwardedRef, ...props } = this.props;
			 let newProps = Object.assign({}, props, {
				 ref: forwardedRef,
			 }) as any as P;
 
			 if (!this.integralModulesName.length) {
				 console.warn(`modules: ${moduleNames.join()} is not exits!`);
				 return <WrappedComponent {...newProps} />;
			 }
			 if (this.state.modulesHasLoaded === false) {
				 return <this.LoadingComponent />;
			 }
			 const { store, integralModulesName } = this;
			 
			 this.injectModules = integralModulesName.reduce((res, mn: ModuleName) => {
				 res[mn] = store.getModule(mn);
				 return res;
			 }, {} as Modules);
 
			 Object.assign(newProps, this.injectModules)
 
			 return <WrappedComponent {...newProps} />;
		 }
	 }
	 let FinalConnect:any = Connect;
	 if (!!React.forwardRef) {
		 FinalConnect = React.forwardRef<any, any>(
			 function ForwardConnect(props: P, ref) {return <Connect {...props} forwardedRef={ref} />}
		 );
	 }
	 return hoistStatics(FinalConnect, WrappedComponent);
 }
 
 type ConnectFun<
	 ST extends InjectStoreModules,
	 MNS extends Extract<keyof ST, string>,
 > = {
	 <P extends Pick<ST, MNS>, SP = Pick<ST, MNS>>(
		 WC: TReactComponent<P>,
		 LC?: TReactComponent<{}>
	 ): ConnectReturn<P, SP>;
	 type: Pick<ST, MNS>;
	 watch<MN extends MNS>(mn: MN, dep: ModuleDepDec<ST, MN>[1]): ConnectFun<ST, MNS>;
 };
 
 
 const createInject = <
	 M extends Modules,
	 LM extends LazyStoreModules,
	 ST extends InjectStoreModules = GenerateStoreType<M, LM>,
 >({
	 storeGetter,
	 loadingComponent = Loading,
 }: {
	 storeGetter: StoreGetter<M, LM>
	 loadingComponent?: TReactComponent<{}>
 }) => {
	 debugger
	 function Inject<MNS extends Extract<keyof ST, string>>(...moduleDec: [MNS|ModuleDepDec<ST, MNS>]): ConnectFun<ST, MNS>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
	 ]): ConnectFun<ST, MNS1|MNS2>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
		 MNS6 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
		 MNS6|ModuleDepDec<ST, MNS6>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5|MNS6>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
		 MNS6 extends Extract<keyof ST, string>,
		 MNS7 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
		 MNS6|ModuleDepDec<ST, MNS6>,
		 MNS7|ModuleDepDec<ST, MNS7>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5|MNS6|MNS7>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
		 MNS6 extends Extract<keyof ST, string>,
		 MNS7 extends Extract<keyof ST, string>,
		 MNS8 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
		 MNS6|ModuleDepDec<ST, MNS6>,
		 MNS7|ModuleDepDec<ST, MNS7>,
		 MNS8|ModuleDepDec<ST, MNS8>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5|MNS6|MNS7|MNS8>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
		 MNS6 extends Extract<keyof ST, string>,
		 MNS7 extends Extract<keyof ST, string>,
		 MNS8 extends Extract<keyof ST, string>,
		 MNS9 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
		 MNS6|ModuleDepDec<ST, MNS6>,
		 MNS7|ModuleDepDec<ST, MNS7>,
		 MNS8|ModuleDepDec<ST, MNS8>,
		 MNS9|ModuleDepDec<ST, MNS9>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5|MNS6|MNS7|MNS8|MNS9>;
	 function Inject<
		 MNS1 extends Extract<keyof ST, string>,
		 MNS2 extends Extract<keyof ST, string>,
		 MNS3 extends Extract<keyof ST, string>,
		 MNS4 extends Extract<keyof ST, string>,
		 MNS5 extends Extract<keyof ST, string>,
		 MNS6 extends Extract<keyof ST, string>,
		 MNS7 extends Extract<keyof ST, string>,
		 MNS8 extends Extract<keyof ST, string>,
		 MNS9 extends Extract<keyof ST, string>,
		 MNS10 extends Extract<keyof ST, string>,
	 >(...moduleDec: [
		 MNS1|ModuleDepDec<ST, MNS1>,
		 MNS2|ModuleDepDec<ST, MNS2>,
		 MNS3|ModuleDepDec<ST, MNS3>,
		 MNS4|ModuleDepDec<ST, MNS4>,
		 MNS5|ModuleDepDec<ST, MNS5>,
		 MNS6|ModuleDepDec<ST, MNS6>,
		 MNS7|ModuleDepDec<ST, MNS7>,
		 MNS8|ModuleDepDec<ST, MNS8>,
		 MNS9|ModuleDepDec<ST, MNS9>,
		 ...Array<MNS10|ModuleDepDec<ST, MNS10>>,
	 ]): ConnectFun<ST, MNS1|MNS2|MNS3|MNS4|MNS5|MNS6|MNS7|MNS8|MNS9|MNS10>;
	 function Inject<
		 MNS extends Extract<keyof ST, string>,
	 >(...moduleDec: Array<MNS|ModuleDepDec<ST, MNS>>
	 ) {
		 const depDecs: DepDecs = {};
		 const moduleNames = moduleDec.map(m => {
			 if (isModuleDepDec(m)) {
				 depDecs[m[0]] = m[1];
				 return m[0];
			 }
			 return m as string;
		 });
		 const connectHOC = <P extends Pick<ST, MNS>>(
			 WrappedComponent: TReactComponent<P>,
			 LoadingComponent: TReactComponent<{}> = loadingComponent
		 ) => connect<P, Pick<ST, MNS>, M, LM>(moduleNames, depDecs, storeGetter, WrappedComponent, LoadingComponent);
 
		 const type = null as any as Pick<ST, MNS>;
		 connectHOC.type = type;
		 connectHOC.watch = function watch<MN extends MNS>(mn: MN, dep: ModuleDepDec<ST, MN>[1]): ConnectFun<ST, MNS> {
			 if (moduleNames.includes(mn) && isModuleDepDec([mn, dep])) {
				 depDecs[mn] = dep;
			 }
			 return connectHOC as ConnectFun<ST, MNS>;
		 }
		 return connectHOC;
	 }
 
	 Inject.setLoadingComponent = (LoadingComponent: TReactComponent<{}>) => Loading = LoadingComponent;
	 return Inject;
 };
 
 export default createInject;
 
 