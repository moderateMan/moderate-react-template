import { State } from './ts-utils'
import { getValueFromObjByKeyPath, arrayIsEqual } from './utils'

type MapDepParser = (s: State, p: any) => any;

export default class MapCache {

	private map: Function;
	private mapDepends: Array<Function> = [];
	private depCache: Array<any> = [];
	private getState: () => State;
	private shouldCheckDependsCache: boolean = true;
	private value: any;

	static getValueFromState: MapDepParser = getValueFromObjByKeyPath;

	constructor(
		getState: () => State,
		map: Array<string | Function>
	) {
		this.getState = getState;
		const copyMap = map.slice();
		this.map = copyMap.pop() as Function;
		copyMap.forEach(item => this.mapDepends.push(this.createGetDepByKeyPath(item)));
	}
	static resetMapDepParser() {
		MapCache.getValueFromState = getValueFromObjByKeyPath;
	}
	static setMapDepParser(parser: MapDepParser) {
		MapCache.getValueFromState = parser;
	}
	createGetDepByKeyPath(keyPath: string | Function) {
		if (typeof keyPath !== 'function') {
			return (s: State) => {
				return MapCache.getValueFromState(s, keyPath);
			};
		}
		return keyPath;
	}
	shouldCheckCache() {
		this.shouldCheckDependsCache = true;
	}
	getDepsValue() {
		return this.mapDepends.map(dep => dep(this.getState()));
	}
	hasDepChanged() {
		if (this.shouldCheckDependsCache) {
			const newDepCache = this.getDepsValue();
			let depHasChanged = !arrayIsEqual(this.depCache, newDepCache);
			if (depHasChanged) {
				this.depCache = newDepCache;
			}
			this.shouldCheckDependsCache = false;
			return depHasChanged;
		}
		return false;
	}
	getValue() {
		if (this.hasDepChanged()) {
			this.value = this.map(...this.depCache);
		}
		return this.value;
	}

	destroy() {
		this.map = () => {};
		this.mapDepends = [];
		this.depCache = [];
		this.getState = () => ({});
	}
}
