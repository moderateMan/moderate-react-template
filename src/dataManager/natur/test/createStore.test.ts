import { createStore, Store } from '../src';
import {
	promiseMiddleware,
	filterNonObjectMiddleware,
	fillObjectRestDataMiddleware,
	filterUndefinedMiddleware,
	shallowEqualMiddleware, 
	thunkMiddleware,
	ThunkParams,
} from '../src/middlewares'

let countMapCallTimes = 0;

type M = {
	count: typeof count,
	countWithoutMaps: typeof countWithoutMaps,
	name: typeof name,
	nameWithMaps: typeof nameWithMaps,
	name1: any;
	name11: any;
	count1: any;
};
let store: Store<M , {}>;

const countState = {
	count: 0,
	name: 'count',
	obj: [{
		t: {
			a: 1,
		}
	}, {
		a: {
			a: 2
		},
	}]
};
const countMaps = {
	isOdd: ['count', (count: CountState['count']) => count % 2 !== 0],
	isOdd2: ({count}: CountState) => count % 2 !== 0,
	isTrue: () => true,
	getSplitNameWhenCountIsOdd: ['count', 'name', (count: CountState['count'], name: CountState['name']) => {
		countMapCallTimes ++;
		if (count % 2 !== 0) {
			return name && name.split('');
		}
		return count;
	}],
	a1: ['obj[0].t.a', (a: number) => a + 1],
	a2: [
		(state: CountState) => state.obj[1].a!.a,
		(a: number) => a + 1
	],
};

type CountState = typeof countState;
type CountMaps = typeof countMaps;


export const count = {
	state: countState,
	maps: countMaps,
	actions: {
		inc: (state: CountState) => ({ ...state, count: state.count + 1 }),
		_inc: () => ({getState, setState, getMaps}: ThunkParams<CountState, CountMaps>) => {
			expect(getMaps()).toEqual({
				isOdd: true,
				isOdd2: true,
				isTrue: true,
				getSplitNameWhenCountIsOdd: 'count'.split(''),
				a1: 2,
				a2: 3,
			});
			return setState({ ...getState(), count: getState().count + 1 });
		},
		updateName: (state: CountState) => ({ ...state, name: state.name + 1 }),
		asyncInc: (state: CountState) => Promise.resolve({ ...state, count: state.count + 1 }),
		dec: (state: CountState) => ({ ...state, count: state.count - 1 }),
		returnGet: (state: any) => state,
		asyncReturnGet: (state: any) => Promise.resolve(state),

		throwErrorAction: () => {
			throw new Error('something error');
		},
		asyncThrowErrorAction: () => Promise.reject('async something error'),
		addA1: (state: CountState) => ({
			...state,
			obj: [{
				t: {
					a: 5,
				}
			}, {
				a: {
					a: 2
				},
			}]
		}),
		addA2: (state: CountState) => ({
			...state,
			obj: [{
				t: {
					a: 2,
				}
			}, {
				a: {
					a: 10
				},
			}]
		})
	},
}

const countWithoutMapsState = {
	count: 0,
	name: 'count',
};
type CountWithoutMapsState = typeof countWithoutMapsState;

export const countWithoutMaps = {
	state: countWithoutMapsState,
	actions: {
		inc: (state: CountWithoutMapsState) => ({ ...state, count: state.count + 1 }),
		asyncInc: (state: CountWithoutMapsState) => Promise.resolve({ ...state, count: state.count + 1 }),
		dec: (state: CountWithoutMapsState) => ({ ...state, count: state.count - 1 }),
	},
}
export const name = {
	state: {
		name: 'test',
	},
	actions: {
		updateName: (name: string) => ({ name }),
	},
}
export const nameWithMaps = {
	state: {
		name: 'test',
	},
	actions: {
		updateName: (name: string) => ({ name }),
	},
	maps: {
		splitName: ['name', (name: string) => name.split('')],
	}
}

const hasModule = (moduleName: keyof M) => () => {
	expect(store.hasModule(moduleName)).toBe(true);
}
const hasNotModule = (notExistModuleName: string) => () => {
	expect(store.hasModule(notExistModuleName as any)).toBe(false);
}
const getModule = <MN extends keyof M>(moduleName: MN, originModule: M[MN]) => () => {
	const targetModule = store.getModule(moduleName as any);
	expect(targetModule.state).toBe(originModule.state);
	expect(targetModule.state).toEqual(originModule.state);
	expect(targetModule.actions).not.toEqual(originModule.actions);
	expect(Object.keys(targetModule.actions)).toEqual(Object.keys(originModule.actions));
}
const getOriginModule = <MN extends keyof M>(moduleName: MN, originModule: M[MN]) => () => {
	const targetModule = store.getOriginModule(moduleName);
	expect(targetModule.state).toBe(originModule.state);
	expect(targetModule.state).toEqual(originModule.state);
	expect(targetModule.actions).toBe(originModule.actions);
	// @ts-ignore
	expect(targetModule.maps).toBe(originModule.maps);
}
const getModuleNotExist = (moduleName: string) => () => {
	expect(() => store.getModule(moduleName as any)).toThrowError(new RegExp(`module: ${moduleName} is not valid!`));
}
const getModuleWithMaps = <MN extends 'count'|'nameWithMaps'>(moduleName: MN, originModule: M[MN]) => () => {
	const targetModule = store.getModule(moduleName);
	expect(targetModule.maps).not.toBe(originModule.maps);
	expect(Object.keys(targetModule.maps)).toEqual(Object.keys(originModule.maps));
}
const getModuleWithoutMaps = <MN extends 'countWithoutMaps'|'name'>(moduleName: MN, originModule: M[MN]) => () => {
	const targetModule = store.getModule(moduleName);
	// @ts-ignore
	expect(targetModule.maps).toBe(undefined);
}
const getAllModuleName = (expectAllModuleName: string[]) => () => {
	const amn = store.getAllModuleName();
	const amn1 = store.getAllModuleName();
	expect(amn).toEqual(expectAllModuleName);
	expect(amn).toBe(amn1);
}

const updateCountState = () => {
	let countModule = store.getModule('count');

	// count = 0, name='count', isOdd = false, getSplitNameWhenCountIsOdd = 'count'.split('');
	// mapCallTime: 1,
	expect(countModule.state.count).toBe(0);
	expect(countModule.maps.isOdd).toBe(false);
	expect(countModule.maps.isOdd2).toBe(false);
	expect(countModule.maps.getSplitNameWhenCountIsOdd).toBe(countModule.state.count);

	// count = 1, name='count', isOdd = true, getSplitNameWhenCountIsOdd = 'count'.split('');
	countModule.actions.inc(countModule.state);
	countModule = store.getModule('count');
	expect(countModule.state.count).toBe(1);
	expect(countModule.maps.isOdd).toBe(true);
	expect(countModule.maps.isOdd2).toBe(true);
	expect(countModule.maps.getSplitNameWhenCountIsOdd).toEqual(countModule.state.name.split(''));


	// count = 1, name='count1', isOdd = true, getSplitNameWhenCountIsOdd = 'count1'.split(''),
	countModule.actions.updateName(countModule.state);
	countModule = store.getModule('count');
	expect(countModule.maps.getSplitNameWhenCountIsOdd).toEqual('count1'.split(''));

	// count = 0; isOdd = false, getSplitNameWhenCountIsOdd = 0;
	countModule.actions.dec(countModule.state);
	countModule = store.getModule('count');
	expect(countModule.state.count).toBe(0);
	expect(countModule.maps.isOdd).toBe(false);
	expect(countModule.maps.isOdd2).toBe(false);
	expect(countModule.maps.getSplitNameWhenCountIsOdd).toBe(0);

	return countModule.actions.asyncInc(countModule.state)
		.then(state => {
			countModule = store.getModule('count');
			expect(countModule.state).toBe(state);
			expect(countModule.state.count).toBe(1);
			expect(countModule.maps.isOdd).toBe(true);
			expect(countModule.maps.isOdd2).toBe(true);
		});
}
const countMapsCache = () => {
	countMapCallTimes = 0;
	let countModule = store.getModule('count');

	expect(countModule.maps.a1).toBe(2)
	expect(countModule.maps.a2).toBe(3)
	countModule.actions.addA1(countModule.state);
	countModule = store.getModule('count');
	expect(countModule.maps.a1).toBe(6)
	countModule.actions.addA2(countModule.state);
	countModule = store.getModule('count');
	expect(countModule.maps.a2).toBe(11)


	// count: 0, isOdd: false
	countModule.maps.getSplitNameWhenCountIsOdd;
	countModule.maps.getSplitNameWhenCountIsOdd;
	expect(countMapCallTimes).toBe(1);

	// name: 'count1'
	countModule.actions.updateName(countModule.state);
	countModule = store.getModule('count');
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	expect(countMapCallTimes).toBe(2);

	// name: 'count11'
	countModule.actions.updateName(countModule.state);
	countModule = store.getModule('count');
	countModule.maps.getSplitNameWhenCountIsOdd
	expect(countMapCallTimes).toBe(3);

	// count: 1, isOdd: true
	countModule.actions.inc(countModule.state);
	countModule = store.getModule('count');
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	countModule.maps.getSplitNameWhenCountIsOdd
	expect(countMapCallTimes).toBe(4);

	// name: 'count111'
	countModule.actions.updateName(countModule.state);
	countModule = store.getModule('count');
	countModule.maps.getSplitNameWhenCountIsOdd
	expect(countMapCallTimes).toBe(5);

	// name: 'count1111'
	countModule.actions.updateName(countModule.state);
	countModule = store.getModule('count');
	countModule.maps.getSplitNameWhenCountIsOdd
	expect(countMapCallTimes).toBe(6);

}

describe('init', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore(
			{ count, countWithoutMaps },
			{},
			{
				middlewares: [
					promiseMiddleware, 
					filterNonObjectMiddleware, 
					shallowEqualMiddleware
				]
			},
		);
	});
	test('createStore with illegal module', () => {
		let store: Store<{
			count: {
				state: any;
				actions: any;
				maps: any;
			}
		}, {}>;
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: {a: 1},
			// @ts-ignore
			actions: {a: 1},
			// @ts-ignore
			maps: {a: 1}
		} }, {})).toThrow();
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: {a: 1},
			// @ts-ignore
			actions: {a: 1},
		}}, {})).toThrow();
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: {a: 1},
			actions: {a: () => {}},
		}}, {})).not.toThrow();
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: [1],
			actions: {a: () => {}},
		}}, {})).not.toThrow();
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: () => {},
			actions: {a: () => {}},
		}}, {})).not.toThrow();
		// @ts-ignore
		expect(() => store = createStore({ count: {
			state: new Date(),
			actions: {a: () => {}},
		}}, {})).not.toThrow();
		expect(() => store = createStore({ count: {
			state: {a: 1},
			actions: {a: () => {}},
			maps: {a: () => {}}
		}}, {})).not.toThrow();
		expect(() => store = createStore({ count: {
			state: {},
			actions: {},
			maps: {}
		}}, {})).not.toThrow();
	})
	test('createStore', () => {
		expect(Object.keys(store)).toEqual([
			'getAllModuleName',
			'getModule',
			'getOriginModule',
			'getLazyModule',
			'loadModule',
			'setModule',
			'removeModule',
			'hasModule',
			'setLazyModule',
			'removeLazyModule',
			'subscribe',
			'destroy',
			'dispatch',
			'globalSetStates',
			'globalResetStates',
			'getAllStates',
			'type'
		]);
	});
	test('hasModule', hasModule('count'));
	test('run actions', updateCountState);
	test('maps cache', countMapsCache);

	test('get module', getModule('count', count));
	test('get origin module', getOriginModule('count', count));

	test('hasNotModule', hasNotModule('name'));
	test('get module not exist', getModuleNotExist('name'));
	test('get moduleWithoutMaps', getModuleWithoutMaps('countWithoutMaps', countWithoutMaps));
	test('get moduleWithMaps', getModuleWithMaps('count', count));
	test('getAllModuleName', getAllModuleName(['count', 'countWithoutMaps']))

});

describe('destroy', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ name }, {}, {
			middlewares: [
				promiseMiddleware,
				filterNonObjectMiddleware,
				shallowEqualMiddleware
			]
		});
		// @ts-ignore
		store.setModule('count', name);
		store.setModule('nameWithMaps', nameWithMaps);
		store.setModule('count', count);
	});
	test('destroy', () => {
		expect(store.hasModule('name')).toBe(true);
		store.destroy();
		expect(store.hasModule('name')).toBe(false);
	})
});

describe('setModule', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ name }, {}, {
			middlewares: [
				promiseMiddleware,
				filterNonObjectMiddleware,
				shallowEqualMiddleware
			]
		});
		// @ts-ignore
		store.setModule('count', name);
		store.setModule('nameWithMaps', nameWithMaps);
		store.setModule('count', count);
	});
	test('run actions', updateCountState);
	test('maps cache', countMapsCache);
	test('set illegal module', () => {
		expect(() => store.setModule('name1', {})).toThrow();
		expect(() => store.setModule('name1', {
			state: {a:1},
			actions: {a:1},
			maps: {a:1}
		})).toThrow();
		expect(() => store.setModule('name1', {
			state: {a:1},
			actions: {a:() => {}},
			maps: {a:1}
		})).toThrow();
		expect(() => store.setModule('name1', {
			state: [{a:1}],
			actions: {a:() => {}},
			maps: {a:() => {}}
		})).not.toThrow();
		expect(() => store.setModule('name1', {
			state: () => {},
			actions: {a:() => {}},
			maps: {a:() => {}}
		})).not.toThrow();
		expect(() => store.setModule('name1', {
			state: {a:1},
			actions: {a:() => {}},
			maps: {a:[() => {}]}
		})).not.toThrow();
		expect(() => store.setModule('name11', {
			state: {},
			actions: {},
			maps: {}
		})).not.toThrow();
		expect(store.getModule('name11').state).toEqual({});
		expect(store.getModule('name11').actions).toEqual({});
		expect(store.getModule('name11').maps).toEqual({});
	})
	test('set module', () => {
		expect(store.setModule('name1', name)).toBe(store);
		expect(() => store.setModule('name11', {})).toThrow();
		expect(store.hasModule('name11')).toBe(false);
	});
	test('set module repeat', () => {
		const nameModule = store.getModule('name');
		expect(() => store.setModule('name', name)).not.toThrow();
		const name2Module = store.getModule('name');
		expect(nameModule).not.toBe(name2Module);
	});
	test('hasModule', hasModule('count'));
	test('hasNotModule', () => {
		hasNotModule('name1')()
		store.setModule('name1', name);
		// @ts-ignore
		hasModule('name1')()
	});
	test('get module', getModule('name', name));
	test('get origin module', getOriginModule('count', count));
	test('get module not exist', getModuleNotExist('name1'));
	test('get moduleWithoutMaps', getModuleWithoutMaps('name', name));
	test('get moduleWithMaps', getModuleWithMaps('nameWithMaps', nameWithMaps));
	test('getAllModuleName', getAllModuleName(['name', 'count', 'nameWithMaps']))
});

describe('removeModule', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore(
			{ count, name }, {}, {
				middlewares: [promiseMiddleware, filterNonObjectMiddleware, shallowEqualMiddleware]
			},
		);
		store.setModule('nameWithMaps', nameWithMaps);
		store.removeModule('count');
	});
	test('module destroy', () => {
		store.setModule('count', count);
		countMapsCache();
		store.removeModule('count');
	})
	test('hasModule', hasModule('name'));
	test('get module', getModule('name', name));
	test('hasNotModule', hasNotModule('count'));
	test('get module not exist', getModuleNotExist('count'));
	test('getAllModuleName', getAllModuleName(['name', 'nameWithMaps']))
});

describe('setModule then removeModule', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ name }, {}, {
			middlewares: [
				promiseMiddleware, 
				filterNonObjectMiddleware,
				shallowEqualMiddleware
			]
		});
		store.setModule('count', count);
		store.setModule('nameWithMaps', nameWithMaps);
		store.removeModule('nameWithMaps');
	});
	test('run actions', updateCountState);
	test('maps cache', countMapsCache);

	test('hasModule', hasModule('name'));
	test('get module', getModule('name', name));
	test('hasNotModule', hasNotModule('nameWithMaps'));
	test('get module not exist', getModuleNotExist('nameWithMaps'));
	test('getAllModuleName', getAllModuleName(['name', 'count']))
});

describe('removeModule then setModule', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ count }, {}, {
			middlewares: [
				promiseMiddleware,
				filterNonObjectMiddleware,
				shallowEqualMiddleware
			]
		});
		store.removeModule('count');
		store.setModule('count', count);
		store.setModule('name', name);
		store.setModule('nameWithMaps', nameWithMaps);
	});
	test('run actions', updateCountState);
	test('maps cache', countMapsCache);
	test('set module', () => {
		// @ts-ignore
		expect(store.setModule('name1', name)).toBe(store);
	});

	test('set module repeat', () => {
		const nameModule = store.getModule('name');
		expect(() => store.setModule('name', name)).not.toThrow();
		const name2Module = store.getModule('name');
		expect(nameModule).not.toBe(name2Module);
	});
	test('hasModule', hasModule('count'));
	test('hasNotModule', () => {
		hasNotModule('name1')()
		// @ts-ignore
		store.setModule('name1', name);
		// @ts-ignore
		hasModule('name1')()
	});
	test('get module', getModule('name', name));
	test('get module not exist', getModuleNotExist('name1'));
	test('get moduleWithoutMaps', getModuleWithoutMaps('name', name));
	test('get moduleWithMaps', getModuleWithMaps('nameWithMaps', nameWithMaps));
	test('getAllModuleName', getAllModuleName(['count', 'name', 'nameWithMaps']))
});

describe('lazyModule', () => {
	const lazyModule = () => Promise.resolve({default: count});
	const lazyModuleWithoutMaps = () => Promise.resolve(countWithoutMaps);

	beforeEach(() => {
		// @ts-ignore
		store = createStore({
			count,
			name
		}, {
			lazyModule,
			lazyModuleWithoutMaps,
		});
	});
	test('hasModule', hasModule('name'));
	test('get module', getModule('name', name));
	test('get lazy module', () => {
		// @ts-ignore
		expect(store.getLazyModule('lazyModule')).toBe(lazyModule);
		// @ts-ignore
		expect(() => store.getLazyModule('lazyModule111')).toThrow();
		// @ts-ignore
		expect(store.getLazyModule('lazyModuleWithoutMaps')).toBe(lazyModuleWithoutMaps);
	});
	test('hasNotModule', hasNotModule('lazyModule'));
	test('get module not exist', getModuleNotExist('lazyModule'));
	test('getAllModuleName', getAllModuleName(['count', 'name', 'lazyModule', 'lazyModuleWithoutMaps']))
});

describe('loadModule', () => {
	const lazyModule = () => Promise.resolve({default: count});
	const lazyModuleWithoutMaps = () => Promise.resolve(countWithoutMaps);

	beforeEach(() => {
		// @ts-ignore
		store = createStore({
			count,
			name
		}, {
			lazyModule,
			lazyModuleWithoutMaps,
		});
	});
	test('load exist module', () => {
		const countModule = store.getModule('count');
		// @ts-ignore
		return store.loadModule('count')
			.then(_countModule => {
				// @ts-ignore
				expect(countModule.actions).toBe(_countModule.actions);
			})
	});
	test('load not exist module', () => {
		// @ts-ignore
		expect(store.hasModule('lazyModule')).toBe(false);
		// @ts-ignore
		return store.loadModule('lazyModule')
			.then(() => {
				// @ts-ignore
				expect(store.hasModule('lazyModule')).toBe(true);
			})
	});
});

describe('set lazy module', () => {
	const lazyModule = () => Promise.resolve(count);
	let store: Store<{
		count: typeof count;
		name: typeof name;
	}, {
		lazyModule: typeof lazyModule;
	}>
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ count, name }, {});
	});
	test('set not exsit lazy module', () => {
		store.setLazyModule('lazyModule', lazyModule);
		expect(store.getLazyModule('lazyModule')).toBe(lazyModule);
	});
	test('set exsit lazy module', () => {
		store.setLazyModule('lazyModule', lazyModule);
		const _lazyModule = () => Promise.resolve(count);
		expect(store.getLazyModule('lazyModule')).toBe(lazyModule);
		store.setLazyModule('lazyModule', _lazyModule);
		expect(store.getLazyModule('lazyModule')).toBe(_lazyModule);
	});
});

describe('remove lazy module', () => {
	const lazyModule = () => Promise.resolve(count);
	let store: Store<{
		count: typeof count;
		name: typeof name;
	}, {
		lazyModule: typeof lazyModule;
	}>
	beforeEach(() => {
		store = createStore({ count, name }, {
			lazyModule,
		});
	});
	test('remove lazy module', () => {
		expect(store.getLazyModule('lazyModule')).toBe(lazyModule);
		store.removeLazyModule('lazyModule');

		expect(() => store.getLazyModule('lazyModule')).toThrow();
	});
});

describe('subscribe', () => {
	let store: Store<{
		count: typeof count;
	}, {}>
	beforeEach(() => {
		store = createStore(
			{ count }, {},
			{
				middlewares: [
					promiseMiddleware,
					filterNonObjectMiddleware, 
					shallowEqualMiddleware
				]
			},
		);
	});
	test('subscribe listener get update module event', done => {
		let countModule = store.getModule('count');
		store.subscribe('count', ({type, actionName}) => {
			expect(type).toBe('update');
			expect(actionName).toBe('inc');
			done();
		});
		countModule.actions.inc(countModule.state);
	});
	test('subscribe listener get init module event', done => {
		store.subscribe('count', ({type, actionName}) => {
			expect(type).toBe('init');
			expect(actionName).toBe(undefined);
			done();
		});
		store.setModule('count', count);
		// countModule.actions.inc(countModule.state);
	});
	test('subscribe listener get remove module event', done => {
		store.subscribe('count', ({type, actionName}) => {
			expect(type).toBe('remove');
			expect(actionName).toBe(undefined);
			done();
		});
		store.removeModule('count');
	});
	test('subscribe listener', done => {
		let countModule = store.getModule('count');
		const oldCount = countModule.state.count;
		const unsub = store.subscribe('count', () => {
			countModule = store.getModule('count');
			expect(Object.keys(countModule.state)).toEqual(['count', 'name', 'obj']);
			expect(countModule.state.count).toBe(oldCount + 1);
			expect(countModule.maps.isOdd).toBe(true);
			done();
		});
		countModule.actions.inc(countModule.state);
	});
	test('subscribe unsuscribe', () => {
		let countModule = store.getModule('count');
		let callTimes = 0;
		const unsub = store.subscribe('count', () => {
			callTimes ++;
		});
		countModule.actions.inc(countModule.state);
		countModule = store.getModule('count');
		countModule.actions.inc(countModule.state);
		countModule = store.getModule('count');
		unsub();
		countModule.actions.inc(countModule.state);
		expect(callTimes).toBe(2);
	});
	test('subscribe async actions unsuscribe', () => {
		let countModule = store.getModule('count');
		let callTimes = 0;
		const unsub = store.subscribe('count', () => callTimes ++);
		countModule.actions.inc(countModule.state);
		countModule = store.getModule('count');
		return countModule.actions.asyncInc(countModule.state)
			.then(() => {
				expect(callTimes).toBe(2);
			})
	});
});

describe('actions', () => {
	let store: Store<{
		count: typeof count;
		name: typeof name;
	}, {}>
	beforeEach(() => {
		let recordCache: any = null;
		store = createStore({ name, count }, {}, {
			initStates: {
				count: {
					...count.state,
					count: 1,
				}
			},
			middlewares: [
				thunkMiddleware,
				({getState}) => next => record => {
					expect(getState()).toBe(store.getModule('count').state);
					recordCache = {...record};
					return next(recordCache)
				},
				() => next => record => {
					expect(record).toBe(recordCache);
					return next(record)
				},
				promiseMiddleware,
				shallowEqualMiddleware,
				filterNonObjectMiddleware,
				filterUndefinedMiddleware
			]
		});
	});
	test('dispatch', () => {
		const countModule = store.getModule('count');
		expect(store.dispatch('count', 'inc', countModule.state).count).toBe(countModule.state.count+1);
		// @ts-ignore
		expect(() => store.dispatch('inc', countModule.state).count).toThrowError();
	});
	test('dispatch error action', () => {
		const countModule = store.getModule('count');
		// @ts-ignore
		expect(store.dispatch('count', 'inc2', countModule.state)).toBe(undefined);
		// @ts-ignore
		expect(store.dispatch('count', 'inc/aa/22', countModule.state)).toBe(undefined);
		// @ts-ignore
		expect(store.dispatch('inc', countModule.state)).toBe(undefined);
	});
	test('return no change state', () => {
		let recordCache: any = null;
		let store: Store<{
			count: typeof count;
			name: typeof name;
		}, {}>
		store = createStore({ name, count }, {}, {
			initStates: {
				count: {
					...count.state,
					count: 1,
				}
			},
			middlewares: [
				thunkMiddleware,
				({getState}) => next => record => {
					expect(getState()).toBe(store.getModule('count').state);
					recordCache = {...record};
					return next(recordCache)
				},
				() => next => record => {
					expect(record).toBe(recordCache);
					// if (!isObj(record.state)) return record.state;
					return next(record)
				},
				promiseMiddleware,
				filterNonObjectMiddleware,
			]
		}, );
		let countModule = store.getModule('count');
		expect(countModule.actions.returnGet(countModule.state)).toBe(countModule.state);
		expect(store.dispatch('count', 'returnGet', countModule.state)).toBe(countModule.state);
	});
	test('return function', () => {
		let countModule = store.getModule('count');
		expect(countModule.actions._inc().count).toBe(countModule.state.count + 1);
	});
	test('return invalid type', () => {
		const countModule = store.getModule('count');


		expect(countModule.actions.returnGet(0)).toBe(0);
		expect(countModule.actions.returnGet('')).toBe('');
		expect(countModule.actions.returnGet(false)).toBe(false);
		expect(countModule.actions.returnGet(null)).toBe(null);
		expect(countModule.actions.returnGet(undefined)).toBe(undefined);

		class Person {};
		const now = new Date();
		const p = new Person();
		expect(countModule.actions.returnGet(now)).toBe(now);
		expect(countModule.actions.returnGet(p)).toBe(p);
		expect(countModule.actions.returnGet(1)).toBe(1);
		expect(countModule.actions.returnGet('null')).toBe('null');
		expect(countModule.actions.returnGet([1,2,3])).toEqual([1,2,3]);

		const {asyncReturnGet} = countModule.actions;

		return Promise.all([
			asyncReturnGet(0),
			asyncReturnGet(''),
			asyncReturnGet(false),
			asyncReturnGet(null),
			asyncReturnGet(undefined),
			asyncReturnGet(1),
			asyncReturnGet('null'),
			asyncReturnGet([1,2,3]),
		]).then(res => {
			expect(res[0]).toBe(0);
			expect(res[1]).toBe('');
			expect(res[2]).toBe(false);
			expect(res[3]).toBe(null);
			expect(res[4]).toBe(undefined);
			expect(res[5]).toBe(1);
			expect(res[6]).toBe('null');
			expect(res[7]).toEqual([1,2,3]);
		});
	});
	test('return normal', () => {
		let countModule = store.getModule('count');

		expect(countModule.state.count).toBe(1);
		expect(countModule.state.name).toBe('count');

		expect(countModule.actions.returnGet(countModule.state)).toBe(countModule.state);
		expect(countModule.actions.returnGet({...countModule.state})).not.toBe(countModule.state);
		expect(countModule.actions.returnGet({...countModule.state, newKey: 1})).not.toBe(countModule.state);

		const {asyncReturnGet} = countModule.actions;
		return Promise.all([
			asyncReturnGet(countModule.state),
			asyncReturnGet({...countModule.state}),
		])
		.then(res => {
			expect(res[0]).toStrictEqual(countModule.state);
			expect(res[1]).toStrictEqual(countModule.state);
		})
	});
	test('return keys changed', () => {
		const countModule = store.getModule('count');
		const newKeyState = {...countModule.state, newKey: 1};
		const deleteKeyState = { ...countModule.state };
		// @ts-ignore
		delete deleteKeyState.name;

		expect(countModule.actions.returnGet(newKeyState).newKey).toBe(1);
		expect(countModule.actions.returnGet(newKeyState)).not.toBe(countModule.state);
		const {state} = store.getModule('count');
		expect(countModule.actions.returnGet(newKeyState)).toBe(state);
		return countModule.actions.asyncReturnGet(deleteKeyState)
			.then((deletedNameState) => {
				expect(deletedNameState.name).toBe(undefined);
				expect(countModule.actions.asyncReturnGet(deleteKeyState)).resolves.toBe(deletedNameState);
			});
	});
	test('throw error', () => {
		const countModule = store.getModule('count');
		expect(countModule.actions.throwErrorAction).toThrow();
		expect(countModule.actions.asyncThrowErrorAction()).rejects.toMatch('async something error');
	});

	test('unlimit state type', () => {
		let _unlimit = {
			state: [1],
			actions: {
				changeState: (a: any) => a,
			},
			maps: {
				firstAdd1: ['0', (f: number) => f + 1]
			}
		};
		let store: Store<{unlimit: typeof _unlimit}, {}>;
		store = createStore({
			unlimit: _unlimit
		}, {});

		let unlimit = store.getModule('unlimit');
		expect(unlimit.maps.firstAdd1).toBe(2)
		expect(unlimit.state).toStrictEqual([1])
		unlimit.actions.changeState([2])

		unlimit = store.getModule('unlimit');
		expect(unlimit.state).toStrictEqual([2])
		expect(unlimit.maps.firstAdd1).toBe(3);

		unlimit = store.getModule('unlimit');
		const ns = new Map();
		ns.set('a', 10);
		unlimit.actions.changeState(ns)
		unlimit = store.getModule('unlimit');
		expect(unlimit.state).toBe(ns)
		expect(unlimit.maps.firstAdd1).toBe(NaN);
	})
});

describe('globalSetStates', () => {
	beforeEach(() => {
		// @ts-ignore
		store = createStore(
			{
				count,
				name,
			},
			{},
			{
				middlewares: [() => next => record => {
					if (record.moduleName === 'nameWithMaps') {
						expect(record.actionName).toBe('globalSetStates');
					}
					return next(record);
				}]
			}
		);
		store.setModule('countWithoutMaps', countWithoutMaps);
	});
	test('base', () => {
		const newStates = {
			count: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			nameWithMaps: {
				name: 'test11',
				name2: 'test2',
			}
		}
		store.subscribe('count', ({type, actionName}) => {
			if (type === 'update' && actionName === 'globalSetStates') {
				expect(store.getModule('count').state).toBe(newStates.count);
			}
		});
		store.subscribe('nameWithMaps', ({type, actionName}) => {
			if (type === 'update' && actionName === 'globalSetStates') {
				expect(store.getModule('nameWithMaps').state).toBe(newStates.nameWithMaps);
			}
		});
		store.globalSetStates(newStates);
		// lazy module
		store.setModule('nameWithMaps', nameWithMaps);

	})
	test('setStates before set module manually', () => {
		const newStates = {
			count1: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
		}
		store.globalSetStates(newStates);
		store.setModule('count1', count);
		expect(store.getModule('count1').state).toBe(newStates.count1);
	});
	test('setStates before lazy module init', () => {
		const newStates = {
			count1: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
		}
		store.setLazyModule('count1', () => Promise.resolve(count));
		store.globalSetStates(newStates);
		// @ts-ignore
		return store.loadModule('count1')
			.then(() => {
				expect(store.getModule('count1').state).toBe(newStates.count1);
			});
	});
});


describe('globalResetStates', () => {
	let store: Store<M & {
		aaaa: typeof count;
		bbbb: typeof name;
	}, {
		lazyCount: () => Promise<typeof count>;
	}>;
	beforeEach(() => {
		// @ts-ignore
		store = createStore(
			{
				count,
				name,
				aaaa: count,
				bbbb: name,
			},
			{
				lazyCount: () => Promise.resolve(count),
			}
		);
		store.setModule('countWithoutMaps', countWithoutMaps);
		store.setModule('nameWithMaps', nameWithMaps);
	});
	test('base', () => {
		const newStates = {
			count: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			nameWithMaps: {
				name: 'test11',
				name2: 'test2',
			}
		}
		store.globalSetStates(newStates);
		expect(store.getModule('count').state).toBe(newStates.count);
		store.globalResetStates();
		expect(store.getModule('count').state).toBe(count.state);
		expect(store.getModule('nameWithMaps').state).toBe(nameWithMaps.state);
	});

	test('include', () => {
		const newStates = {
			count: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			aaaa: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			countWithoutMaps: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			name: {
				name: 'test11',
				name2: 'test2',
			},
			nameWithMaps: {
				name: 'test11',
				name2: 'test2',
			},
			bbbb: {
				name: 'test11',
				name2: 'test2',
			}
		}
		store.globalSetStates(newStates);
		expect(store.getModule('count').state).toBe(newStates.count);
		store.globalResetStates({include: ['count', /aa/, /bb/]});
		
		
		expect(store.getModule('count').state).toBe(count.state);
		expect(store.getModule('aaaa').state).toBe(count.state);
		expect(store.getModule('countWithoutMaps').state).toBe(newStates.countWithoutMaps);

		expect(store.getModule('name').state).toBe(newStates.name);
		expect(store.getModule('nameWithMaps').state).toBe(newStates.nameWithMaps);
		expect(store.getModule('bbbb').state).toBe(name.state);
	});

	test('exclude', () => {
		const newStates = {
			count: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			aaaa: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			countWithoutMaps: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			name: {
				name: 'test11',
				name2: 'test2',
			},
			nameWithMaps: {
				name: 'test11',
				name2: 'test2',
			},
			bbbb: {
				name: 'test11',
				name2: 'test2',
			}
		}
		store.globalSetStates(newStates);
		expect(store.getModule('count').state).toBe(newStates.count);
		store.globalResetStates({exclude: ['countWithoutMaps', /name/]});
		
		
		expect(store.getModule('count').state).toBe(count.state);
		expect(store.getModule('aaaa').state).toBe(count.state);
		expect(store.getModule('countWithoutMaps').state).toBe(newStates.countWithoutMaps);

		expect(store.getModule('name').state).toBe(newStates.name);
		expect(store.getModule('nameWithMaps').state).toBe(newStates.nameWithMaps);
		expect(store.getModule('bbbb').state).toBe(name.state);
	});


	test('include and exclude', () => {
		const newStates = {
			count: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			aaaa: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			countWithoutMaps: {
				count: 1,
				name: 'count1',
				obj: [{
					t: {
						a: 11,
					}, 
				}, {
					a: {
						a: 2
					},
				}]
			},
			name: {
				name: 'test11',
				name2: 'test2',
			},
			nameWithMaps: {
				name: 'test11',
				name2: 'test2',
			},
			bbbb: {
				name: 'test11',
				name2: 'test2',
			}
		}
		store.globalSetStates(newStates);
		expect(store.getModule('count').state).toBe(newStates.count);
		store.globalResetStates({
			include: [/count/, 'aaaa', 'bbbb'],
			exclude: ['countWithoutMaps', /name/]
		});
		
		
		expect(store.getModule('count').state).toBe(count.state);
		expect(store.getModule('aaaa').state).toBe(count.state);
		expect(store.getModule('countWithoutMaps').state).toBe(newStates.countWithoutMaps);

		expect(store.getModule('name').state).toBe(newStates.name);
		expect(store.getModule('nameWithMaps').state).toBe(newStates.nameWithMaps);
		expect(store.getModule('bbbb').state).toBe(name.state);
	});


});


describe('getAllStates', () => {
	const initCount = 1;
	beforeEach(() => {
		// @ts-ignore
		store = createStore({ name, count }, {}, {
			middlewares: [
				thunkMiddleware,
				promiseMiddleware
			],
			initStates: {
				count: {
					...count.state,
					count: initCount,
				}
			}
		});
	})
	test('get all states after create store', () => {
		expect(store.getAllStates()).toEqual({
			name: name.state,
			count: {
				...count.state,
				count: initCount,
			}
		});
	});
	test('get all states after state change', () => {
		store.dispatch('name', 'updateName', 'new name');
		store.dispatch('count', '_inc');
		expect(store.getAllStates()).toEqual({
			name: {
				...name.state,
				name: 'new name',
			},
			count: {
				...count.state,
				count: initCount + 1,
			}
		});
	});
})