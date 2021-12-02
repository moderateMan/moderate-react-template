/**
 * @author empty916
 * @email [empty916@qq.com]
 * @create date 2019-08-09 17:13:15
 * @modify date 2019-08-09 17:13:15
 * @desc [description]
 */

import { StoreModule, State } from './ts-utils'

const hasOwn = Object.prototype.hasOwnProperty;
// export const ObjHasSameKeys = (obj1: Object, obj2: Object) => {
// 	if (!obj1 || !obj2) {
// 		return false;
// 	}
// 	if (Object.keys(obj1).length !== Object.keys(obj2).length) {
// 		return false;
// 	}
// 	for(let key in obj1) {
// 		if (hasOwn.call(obj1, key)) {
// 			if (!hasOwn.call(obj2, key)) {
// 				return false;
// 			}
// 		}
// 	}
// 	return true;
// }

type Obj = {[p: string]: any}
type anyFn = (...arg: any[]) => any;
type fnObj = {[p: string]: anyFn};
type mapsObj = {[p: string]: Array<any> | Function};

export const isObj = <T = Obj>(obj: any): obj is T => typeof obj === 'object' && obj !== null && obj.constructor === Object;
export const isFn = (arg: any): arg is anyFn => typeof arg === 'function';
export const isFnObj = (obj: any): obj is fnObj => {
	if (isObj(obj)) {
		return Object.keys(obj).every(key => isFn(obj[key]));
	}
	return false;
}
const isMapsObj = (obj: any): obj is mapsObj => {
	if (isObj(obj)) {
		return Object.keys(obj).every(key => (obj[key].constructor === Array || obj[key].constructor === Function));
	}
	return false;
}

export const isPromise = <T>(obj: any): obj is Promise<T> => obj && typeof obj.then === 'function'
// export const isVoid = <T>(ar: T | void): ar is void => !ar;
export const isStoreModule = (obj: any): obj is StoreModule => {
	if (!isObj(obj) || !isFnObj(obj.actions)) {
		return false;
	}
	if (!!obj.maps && !isMapsObj(obj.maps)){
		return false;
	}
	return true;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export function compose<A extends any[], R extends any>(...funcs: anyFn[]): (...arg: A) => R {
  if (funcs.length === 0) {
    return ((arg: any) => arg) as any;
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


function is(x: any, y: any) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	} else {
		return x !== x && y !== y;
	}
}

export function isEqualWithDepthLimit(
	objA: any,
	objB: any,
	depthLimit: number = 3,
	depth: number = 1,
): boolean {
	if (is(objA, objB)) return true;

	if (
		typeof objA !== 'object' ||
		objA === null ||
		typeof objB !== 'object' ||
		objB === null
	) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i++) {
		if (
			!hasOwn.call(objB, keysA[i]) ||
			!is(objA[keysA[i]], objB[keysA[i]])
		) {
			if (
				typeof objA[keysA[i]] === 'object' &&
				typeof objB[keysB[i]] === 'object' &&
				depth < depthLimit
			) {
				return isEqualWithDepthLimit(
					objA[keysA[i]],
					objB[keysB[i]],
					depthLimit,
					depth + 1,
				);
			}
			return false;
		}
	}

	return true;
}

/**
 * @param obj State
 * @param keyPath 'a.b[0].c'
 */
export function getValueFromObjByKeyPath (obj: State, keyPath: string): any {
	const formatKeyArr = keyPath.replace(/\[/g, '.').replace(/\]/g, '').split('.');
	let value = obj;
	for(let i = 0; i < formatKeyArr.length; i ++) {
		try {
			value = value[formatKeyArr[i]];
		} catch (error) {
			return undefined;
		}
	}
	return value;
}

export function arrayIsEqual (arr1: Array<any>, arr2: Array<any>) {
	if (arr1.length !== arr2.length) {
		return false;
	}
	for(let i = 0; i < arr1.length; i ++) {
		if (arr1[i] !== arr2[i] ) {
			return false;
		}
	}
	return true;
}

