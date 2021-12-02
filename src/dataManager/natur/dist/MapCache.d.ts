import { State } from './ts-utils';
declare type MapDepParser = (s: State, p: any) => any;
export default class MapCache {
    private map;
    private mapDepends;
    private depCache;
    private getState;
    private shouldCheckDependsCache;
    private value;
    static getValueFromState: MapDepParser;
    constructor(getState: () => State, map: Array<string | Function>);
    static resetMapDepParser(): void;
    static setMapDepParser(parser: MapDepParser): void;
    createGetDepByKeyPath(keyPath: string | Function): Function;
    shouldCheckCache(): void;
    getDepsValue(): any[];
    hasDepChanged(): boolean;
    getValue(): any;
    destroy(): void;
}
export {};
