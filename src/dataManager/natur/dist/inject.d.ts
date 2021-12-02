/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:03
 * @modify date 2019-08-09 17:13:03
 * @desc [description]
 */
import React from 'react';
import { Store, Modules, InjectStoreModules, LazyStoreModules, GenerateStoreType, PickLazyStoreModules } from './ts-utils';
import { ModuleDepDec } from './injectCache';
declare type TReactComponent<P> = React.FC<P> | React.ComponentClass<P>;
export declare type StoreGetter<M extends Modules, LM extends LazyStoreModules> = () => Store<M, LM>;
declare type ConnectReturn<P, SP> = React.ComponentClass<Omit<P, keyof SP> & {
    forwardedRef?: React.Ref<any>;
}>;
declare type ConnectFun<ST extends InjectStoreModules, MNS extends Extract<keyof ST, string>> = {
    <P extends Pick<ST, MNS>, SP = Pick<ST, MNS>>(WC: TReactComponent<P>, LC?: TReactComponent<{}>): ConnectReturn<P, SP>;
    type: Pick<ST, MNS>;
    watch<MN extends MNS>(mn: MN, dep: ModuleDepDec<ST, MN>[1]): ConnectFun<ST, MNS>;
};
declare const createInject: <M extends Modules, LM extends LazyStoreModules, ST extends InjectStoreModules = GenerateStoreType<M, LM, PickLazyStoreModules<LM>>>({ storeGetter, loadingComponent, }: {
    storeGetter: StoreGetter<M, LM>;
    loadingComponent?: TReactComponent<{}> | undefined;
}) => {
    <MNS extends Extract<keyof ST, string>>(moduleDec_0: MNS | ModuleDepDec<ST, MNS>): ConnectFun<ST, MNS>;
    <MNS1 extends Extract<keyof ST, string>, MNS2 extends Extract<keyof ST, string>>(moduleDec_0: MNS1 | ModuleDepDec<ST, MNS1>, moduleDec_1: MNS2 | ModuleDepDec<ST, MNS2>): ConnectFun<ST, MNS1 | MNS2>;
    <MNS1_1 extends Extract<keyof ST, string>, MNS2_1 extends Extract<keyof ST, string>, MNS3 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_1 | ModuleDepDec<ST, MNS1_1>, moduleDec_1: MNS2_1 | ModuleDepDec<ST, MNS2_1>, moduleDec_2: MNS3 | ModuleDepDec<ST, MNS3>): ConnectFun<ST, MNS1_1 | MNS2_1 | MNS3>;
    <MNS1_2 extends Extract<keyof ST, string>, MNS2_2 extends Extract<keyof ST, string>, MNS3_1 extends Extract<keyof ST, string>, MNS4 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_2 | ModuleDepDec<ST, MNS1_2>, moduleDec_1: MNS2_2 | ModuleDepDec<ST, MNS2_2>, moduleDec_2: MNS3_1 | ModuleDepDec<ST, MNS3_1>, moduleDec_3: MNS4 | ModuleDepDec<ST, MNS4>): ConnectFun<ST, MNS1_2 | MNS2_2 | MNS3_1 | MNS4>;
    <MNS1_3 extends Extract<keyof ST, string>, MNS2_3 extends Extract<keyof ST, string>, MNS3_2 extends Extract<keyof ST, string>, MNS4_1 extends Extract<keyof ST, string>, MNS5 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_3 | ModuleDepDec<ST, MNS1_3>, moduleDec_1: MNS2_3 | ModuleDepDec<ST, MNS2_3>, moduleDec_2: MNS3_2 | ModuleDepDec<ST, MNS3_2>, moduleDec_3: MNS4_1 | ModuleDepDec<ST, MNS4_1>, moduleDec_4: MNS5 | ModuleDepDec<ST, MNS5>): ConnectFun<ST, MNS1_3 | MNS2_3 | MNS3_2 | MNS4_1 | MNS5>;
    <MNS1_4 extends Extract<keyof ST, string>, MNS2_4 extends Extract<keyof ST, string>, MNS3_3 extends Extract<keyof ST, string>, MNS4_2 extends Extract<keyof ST, string>, MNS5_1 extends Extract<keyof ST, string>, MNS6 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_4 | ModuleDepDec<ST, MNS1_4>, moduleDec_1: MNS2_4 | ModuleDepDec<ST, MNS2_4>, moduleDec_2: MNS3_3 | ModuleDepDec<ST, MNS3_3>, moduleDec_3: MNS4_2 | ModuleDepDec<ST, MNS4_2>, moduleDec_4: MNS5_1 | ModuleDepDec<ST, MNS5_1>, moduleDec_5: MNS6 | ModuleDepDec<ST, MNS6>): ConnectFun<ST, MNS1_4 | MNS2_4 | MNS3_3 | MNS4_2 | MNS5_1 | MNS6>;
    <MNS1_5 extends Extract<keyof ST, string>, MNS2_5 extends Extract<keyof ST, string>, MNS3_4 extends Extract<keyof ST, string>, MNS4_3 extends Extract<keyof ST, string>, MNS5_2 extends Extract<keyof ST, string>, MNS6_1 extends Extract<keyof ST, string>, MNS7 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_5 | ModuleDepDec<ST, MNS1_5>, moduleDec_1: MNS2_5 | ModuleDepDec<ST, MNS2_5>, moduleDec_2: MNS3_4 | ModuleDepDec<ST, MNS3_4>, moduleDec_3: MNS4_3 | ModuleDepDec<ST, MNS4_3>, moduleDec_4: MNS5_2 | ModuleDepDec<ST, MNS5_2>, moduleDec_5: MNS6_1 | ModuleDepDec<ST, MNS6_1>, moduleDec_6: MNS7 | ModuleDepDec<ST, MNS7>): ConnectFun<ST, MNS1_5 | MNS2_5 | MNS3_4 | MNS4_3 | MNS5_2 | MNS6_1 | MNS7>;
    <MNS1_6 extends Extract<keyof ST, string>, MNS2_6 extends Extract<keyof ST, string>, MNS3_5 extends Extract<keyof ST, string>, MNS4_4 extends Extract<keyof ST, string>, MNS5_3 extends Extract<keyof ST, string>, MNS6_2 extends Extract<keyof ST, string>, MNS7_1 extends Extract<keyof ST, string>, MNS8 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_6 | ModuleDepDec<ST, MNS1_6>, moduleDec_1: MNS2_6 | ModuleDepDec<ST, MNS2_6>, moduleDec_2: MNS3_5 | ModuleDepDec<ST, MNS3_5>, moduleDec_3: MNS4_4 | ModuleDepDec<ST, MNS4_4>, moduleDec_4: MNS5_3 | ModuleDepDec<ST, MNS5_3>, moduleDec_5: MNS6_2 | ModuleDepDec<ST, MNS6_2>, moduleDec_6: MNS7_1 | ModuleDepDec<ST, MNS7_1>, moduleDec_7: MNS8 | ModuleDepDec<ST, MNS8>): ConnectFun<ST, MNS1_6 | MNS2_6 | MNS3_5 | MNS4_4 | MNS5_3 | MNS6_2 | MNS7_1 | MNS8>;
    <MNS1_7 extends Extract<keyof ST, string>, MNS2_7 extends Extract<keyof ST, string>, MNS3_6 extends Extract<keyof ST, string>, MNS4_5 extends Extract<keyof ST, string>, MNS5_4 extends Extract<keyof ST, string>, MNS6_3 extends Extract<keyof ST, string>, MNS7_2 extends Extract<keyof ST, string>, MNS8_1 extends Extract<keyof ST, string>, MNS9 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_7 | ModuleDepDec<ST, MNS1_7>, moduleDec_1: MNS2_7 | ModuleDepDec<ST, MNS2_7>, moduleDec_2: MNS3_6 | ModuleDepDec<ST, MNS3_6>, moduleDec_3: MNS4_5 | ModuleDepDec<ST, MNS4_5>, moduleDec_4: MNS5_4 | ModuleDepDec<ST, MNS5_4>, moduleDec_5: MNS6_3 | ModuleDepDec<ST, MNS6_3>, moduleDec_6: MNS7_2 | ModuleDepDec<ST, MNS7_2>, moduleDec_7: MNS8_1 | ModuleDepDec<ST, MNS8_1>, moduleDec_8: MNS9 | ModuleDepDec<ST, MNS9>): ConnectFun<ST, MNS1_7 | MNS2_7 | MNS3_6 | MNS4_5 | MNS5_4 | MNS6_3 | MNS7_2 | MNS8_1 | MNS9>;
    <MNS1_8 extends Extract<keyof ST, string>, MNS2_8 extends Extract<keyof ST, string>, MNS3_7 extends Extract<keyof ST, string>, MNS4_6 extends Extract<keyof ST, string>, MNS5_5 extends Extract<keyof ST, string>, MNS6_4 extends Extract<keyof ST, string>, MNS7_3 extends Extract<keyof ST, string>, MNS8_2 extends Extract<keyof ST, string>, MNS9_1 extends Extract<keyof ST, string>, MNS10 extends Extract<keyof ST, string>>(moduleDec_0: MNS1_8 | ModuleDepDec<ST, MNS1_8>, moduleDec_1: MNS2_8 | ModuleDepDec<ST, MNS2_8>, moduleDec_2: MNS3_7 | ModuleDepDec<ST, MNS3_7>, moduleDec_3: MNS4_6 | ModuleDepDec<ST, MNS4_6>, moduleDec_4: MNS5_5 | ModuleDepDec<ST, MNS5_5>, moduleDec_5: MNS6_4 | ModuleDepDec<ST, MNS6_4>, moduleDec_6: MNS7_3 | ModuleDepDec<ST, MNS7_3>, moduleDec_7: MNS8_2 | ModuleDepDec<ST, MNS8_2>, moduleDec_8: MNS9_1 | ModuleDepDec<ST, MNS9_1>, ...moduleDec_9: (MNS10 | ModuleDepDec<ST, MNS10>)[]): ConnectFun<ST, MNS1_8 | MNS2_8 | MNS3_7 | MNS4_6 | MNS5_5 | MNS6_4 | MNS7_3 | MNS8_2 | MNS9_1 | MNS10>;
    setLoadingComponent(LoadingComponent: TReactComponent<{}>): TReactComponent<{}>;
};
export default createInject;
