import { createStore } from '../src';
import { isObj } from '../src/utils';
import {
	promiseMiddleware,
	filterNonObjectMiddleware,
	fillObjectRestDataMiddleware,
	filterUndefinedMiddleware,
	shallowEqualMiddleware, 
	thunkMiddleware,
    ThunkParams,
} from '../src/middlewares'

let store: any;

const countState = {
    count: 0,
    name: 'count',
    obj: [1]
};
type CountState = typeof countState;

const countMaps =  {
    isOdd: ['count', (count: number) => count % 2 !== 0],
};

type CountMaps = typeof countMaps;

const count = {
	state: countState,
	actions: {
		inc: (state: CountState) => ({ ...state, count: state.count + 1 }),
		thunkInc: () => ({getState, setState, getMaps, dispatch}: ThunkParams<CountState, CountMaps>) => {
            dispatch('inc', getState());
            dispatch('count2/inc');

            return setState({ ...getState(), count: getState().count + 1 });
        },
        thunkInc2: () => ({getState, setState, getMaps, dispatch}: ThunkParams<CountState, CountMaps>) => {
            dispatch('inc', getState());
            dispatch('count2/inc');
            return { ...getState(), count: getState().count + 1 };
		},
		updateName: () => ({ name: 'tom' }),
		asyncInc: (state: CountState) => Promise.resolve({ ...state, count: state.count + 1 }),
		dec: (state: CountState) => ({ ...state, count: state.count - 1 }),
		returnGet: (state: CountState) => state,
		asyncReturnGet: (state: CountState) => Promise.resolve(state),
		throwErrorAction: () => {
			throw new Error('something error');
		},
		asyncThrowErrorAction: () => Promise.reject('async something error'),
	},
	maps: countMaps,
}

const count2 = {
    state: 0, 
    actions: {
        inc: () => ({getState, setState}: ThunkParams<number>) => setState(getState() + 1),
    }
}

describe('actions', () => {
	test('thunkMiddleware', () => {
        const store = createStore({ count, count2 }, {}, {
            middlewares: [
                thunkMiddleware,
                filterUndefinedMiddleware,
            ]
        });
        const countModule = store.getModule('count');
        
		expect(countModule.maps.isOdd).toBe(false);
        expect(countModule.actions.thunkInc().count).toBe(countModule.state.count + 2);
        const count2Module = store.getModule('count2');
        
		expect(count2Module.state).toBe(1);
        // expect(countModule.actions.thunkInc2()).toBe(true);
    });
    test('promiseMiddleware', () => {
        const store = createStore({ count }, {}, {
            middlewares: [
                promiseMiddleware,
            ]
        });
        let countModule = store.getModule('count');
        return countModule.actions.asyncInc(countModule.state)
            .then(state => {
                expect(state.count).toBe(countModule.state.count + 1);
            })
    });
    test('fillObjectRestDataMiddleware', () => {
        const store = createStore({ count }, {}, {
            middlewares: [
                fillObjectRestDataMiddleware,
            ]
        });
        let countModule = store.getModule('count');
		expect(countModule.actions.updateName().name).toBe('tom');
		expect(countModule.actions.updateName().count).toBe(0);
    });
    test('shallowEqualMiddleware', () => {
        const store = createStore({ count }, {}, {
            middlewares: [
                shallowEqualMiddleware,
            ]
        });
        let countModule = store.getModule('count');
        countModule.actions.returnGet({...countModule.state})
        let newCountModule = store.getModule('count');
		expect(newCountModule.state).toBe(countModule.state);
    });
    test('filterNonObjectMiddleware', () => {
        const store = createStore({ count }, {}, {
            middlewares: [
                filterNonObjectMiddleware,
            ]
        });
        let countModule = store.getModule('count');
        expect(countModule.actions.returnGet(null as any)).toBe(null);
        let newCountModule = store.getModule('count');
		expect(newCountModule.state).toBe(countModule.state);
    });
    test('filterUndefinedMiddleware', () => {
        const store = createStore({ count }, {}, {
            middlewares: [
                filterUndefinedMiddleware,
            ]
        });
        let countModule = store.getModule('count');
        expect(countModule.actions.returnGet(undefined as any)).toBe(undefined);
        let newCountModule = store.getModule('count');
		expect(newCountModule.state).toBe(countModule.state);
    });
});
