import { createStore, Interceptor, MiddlewareParams, Store } from '../src';
import {
	promiseMiddleware, 
	thunkMiddleware,
    ThunkParams,
} from '../src/middlewares'


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
type CountState = typeof countState;

const countMaps = {
    isOdd: ['count', (count: CountState['count']) => count % 2 !== 0],
    isOdd2: ({count}: CountState) => count % 2 !== 0,
    isTrue: () => true,
    getSplitNameWhenCountIsOdd: ['count', 'name', (count: CountState['count'], name: CountState['name']) => {
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
type CountMaps = typeof countMaps;

const count = {
	state: countState,
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
		returnGet: (state: CountState) => state,
		asyncReturnGet: (state: CountState) => Promise.resolve(state),

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
	maps: countMaps,
}

const name = {
	state: {
		name: 'test',
	},
	actions: {
		updateName: (name: string) => ({ name }),
	},
}

let store: Store<{
    count: typeof count;
    name: typeof name;
}, {}>;
type StoreType = typeof store.type;

describe('interceptor', () => {
    const initCount = 1;
    
	test('interceptor base', () => {
        const countInitState = {
            ...count.state,
            count: initCount,
        };
        const countChangedState = {
            ...count.state,
            count: 12345,
        }
        const interceptor1: Interceptor<StoreType> = ({getState, setState, getMaps, dispatch}) => next => interceptorActionRecord => {
            expect(interceptorActionRecord.actionArgs).toStrictEqual([store.getModule('count').state]);
            expect(getState()).toBe(countInitState);
            expect(getMaps()).toStrictEqual(store.getModule('count').maps);
            setState({
                moduleName: interceptorActionRecord.moduleName,
                actionName: interceptorActionRecord.actionName,
                state: countChangedState,
            });
            expect(getState()).toBe(countChangedState);
            expect(getMaps()).toStrictEqual(store.getModule('count').maps);
            return next(interceptorActionRecord);
        }
		store = createStore({ name, count }, {}, {
			middlewares: [
				thunkMiddleware,
				promiseMiddleware
            ],
            interceptors: [
                interceptor1,
            ],
			initStates: {
				count: countInitState
			}
		});
        store.dispatch('count', 'updateName', store.getModule('count').state);
    });

    test('one more interceptor add action arg', () => {
        
        const interceptor1: Interceptor<_ST> = () => next => interceptorActionRecord => {
            return next({
                ...interceptorActionRecord,
                actionArgs: [...interceptorActionRecord.actionArgs, 'interceptor1'],
            });
        }
        const interceptor2: Interceptor<_ST> = () => next => interceptorActionRecord => {
            return next({
                ...interceptorActionRecord,
                actionArgs: [...interceptorActionRecord.actionArgs, 'interceptor2'],
            });
        }
        type _ST = Store<{count: typeof count;}, {}>['type'];

        const count = {
            state: 'abc',
            actions: {
                updateState: (newState: string, interceptor1Str?: string, interceptor2Str?: string) => {
                    expect(interceptor1Str).toBe('interceptor1');
                    expect(interceptor2Str).toBe('interceptor2');
                    return newState;
                }
            }
        };
		const _store = createStore({ 
            count,
        }, {}, {
            interceptors: [
                interceptor1,
                interceptor2,
            ],
		});
        _store.dispatch('count', 'updateState', '123');
        expect(_store.getModule('count').state).toBe('123');
    });

    test('interceptor stop run action', () => {
        const interceptor: Interceptor<ST> = () => next => interceptorActionRecord => {
            if (interceptorActionRecord.actionName === 'updateState1') {
                return next({
                    ...interceptorActionRecord,
                    actionArgs: [...interceptorActionRecord.actionArgs, 'interceptor2'],
                });
            }
        }
        type ST = Store<{count: typeof count}, {}>['type'];
        const count = {
            state: 'abc',
            actions: {
                updateState1: (newState: string) => {
                    return newState;
                },
                updateState2: (newState: string) => {
                    return newState;
                }
            }
        };
		const _store = createStore({ 
            count,
        }, {}, {
            interceptors: [
                interceptor,
            ],
		});
        expect(_store.dispatch('count', 'updateState2', '123')).toBe(undefined);
        expect(_store.getModule('count').state).toBe('abc');
        expect(_store.dispatch('count', 'updateState1', '123')).toBe('123');
        expect(_store.getModule('count').state).toBe('123');
        expect(_store.getModule('count').actions.updateState1('222')).toBe('222');
    });


    test('interceptor get origin action function', () => {
        const action = (newState: string) => {
            return newState;
        };
        const interceptor: Interceptor<ST> = () => next => interceptorActionRecord => {
            expect(interceptorActionRecord.actionFunc).toBe(action);
            return next(interceptorActionRecord);
        }
        const count = {
            state: 'abc',
            actions: {
                updateState: action,
            }
        };
        type ST = Store<{count: typeof count}, {}>['type'];
		const _store = createStore({ 
            count: {
                state: 'abc',
                actions: {
                    updateState: action,
                }
            },
        }, {}, {
            interceptors: [
                interceptor,
            ],
		});
        expect(_store.getModule('count').actions.updateState('222')).toBe('222');
        
    });
})