import MapCache from '../src/MapCache'


describe('map catch', () => {
	const initCount = () => {
		const state =  {
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
			}],
			m: new Map([['m1', 1]])
		};
		type CountState = typeof state;
		const maps = {
			isOdd: ['count', (count: CountState['count']) => {
				mapCallCount ++;
				return count % 2 !== 0;
			}],
			getSplitNameWhenCountIsOdd: ['count', 'name', (count: CountState['count'], name: CountState['name']) => {
				mapCallCount ++;
				if (count % 2 !== 0) {
					return name;
				}
				return count;
			}],
			a1: ['obj[0].t.a', (a: number) => {
				mapCallCount ++;
				return a + 1
			}],
			a2: [
				(state: CountState) => state.obj[1].a!.a,
				(a: number) => {
					mapCallCount ++;
					return a + 1
				}
			],
		};
		type CountMaps = typeof maps;

		return {
			state,
			actions: {
				inc: (state: CountState) => ({ ...state, count: state.count + 1 }),
				updateName: (state: CountState) => ({ ...state, name: state.name + 1 }),
				dec: (state: CountState) => ({ ...state, count: state.count - 1 }),
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
			maps
		};
	};
	let count = initCount();
	type Count = typeof count;
	type MapsCatche = {
		[k in keyof Count['maps']]: MapCache;
	}
	let mapsCatche: MapsCatche = {} as any;

	let mapCallCount = 0;
	beforeEach(() => {
		count = initCount();
		
		Object.keys(count.maps).forEach(mapKey => {
			mapsCatche[mapKey as keyof Count['maps']] = new MapCache(
				() => count.state,
				count.maps[mapKey as keyof Count['maps']],
			)
		})
	})
	const shouldCheckMapsDep = () => {
		for(let i in mapsCatche) {
			mapsCatche[i as keyof MapsCatche].shouldCheckCache();
		}
	};
	const inc = () => {
		count.state.count = count.state.count + 1;
		shouldCheckMapsDep();
	}
	const dec = () => {
		count.state.count = count.state.count - 1;
		shouldCheckMapsDep();
	}
	const updateName = (name: Count['state']['name']) => {
		count.state.name = name;
		shouldCheckMapsDep();
	}
	const setA1 = (a1: number) => {
		count.state.obj[0].t!.a = a1;
		shouldCheckMapsDep();
	}
	const setA2 = (a2: number) => {
		count.state.obj[1].a!.a = a2;
		shouldCheckMapsDep();
	}
	test('map catch get value is correct', () => {
		expect(mapsCatche.isOdd.getValue()).toBe(false);
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe(0);

		inc();
		expect(mapsCatche.isOdd.getValue()).toBe(true);
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe('count');
		expect(mapsCatche.a1.getValue()).toBe(2);
		expect(mapsCatche.a2.getValue()).toBe(3);

		setA1(5);
		expect(mapsCatche.a1.getValue()).toBe(6);
		expect(mapsCatche.a2.getValue()).toBe(3);


		setA2(10);
		expect(mapsCatche.a1.getValue()).toBe(6);
		expect(mapsCatche.a2.getValue()).toBe(11);

	});

	test('map cache call count', () => {
		mapCallCount = 0;
		expect(mapsCatche.isOdd.getValue()).toBe(false);
		dec();inc();
		expect(mapsCatche.isOdd.getValue()).toBe(false);
		expect(mapsCatche.isOdd.getValue()).toBe(false);
		expect(mapCallCount).toBe(1);

		mapCallCount = 0;

		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe(0);
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe(0);
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe(0);
		expect(mapCallCount).toBe(1);

		inc();
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe('count');
		expect(mapCallCount).toBe(2);
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe('count');
		expect(mapCallCount).toBe(2);

		updateName('count1');
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe('count1');
		expect(mapCallCount).toBe(3);

		inc();
		expect(mapsCatche.getSplitNameWhenCountIsOdd.getValue()).toBe(2);
		expect(mapCallCount).toBe(4);
	});

	test('map dep parser', () => {
		const parser = (obj: any, keyPath: string): any => {
			const formatKeyArr = keyPath.replace(/\[/g, '.').replace(/\]/g, '').split('.');
			let value = obj;
			for(let i = 0; i < formatKeyArr.length; i ++) {
				try {
					if (typeof value === 'object' && value !== null && value.constructor === Map) {
						value = value.get(formatKeyArr[i])
					} else {
						value = value[formatKeyArr[i]];
					}
				} catch (error) {
					return undefined;
				}
			}
			return value;
		}
		MapCache.setMapDepParser(parser);
		const countState = {
			count: 0,
			m: new Map([['m1', 1]])
		};
		type CountState = typeof countState;
		const countMaps = {
			mm1: [
				'm.m1',
				(mm1: number) => mm1 + 1
			],
		};
		type CountMaps = typeof countMaps;
		const count = {
			state: countState,
			actions: {
				inc: (state: CountState) => ({ ...state, count: state.count + 1 }),
			},
			maps: countMaps,
		}
		type MapsCatche = {
			[k in keyof CountMaps]: MapCache;
		}
		let mapsCatche: MapsCatche = {} as any;
		Object.keys(count.maps).forEach(mapKey => {
			mapsCatche[mapKey as keyof CountMaps] = new MapCache(
				() => count.state,
				count.maps[mapKey as keyof CountMaps],
			)
		})
		expect(mapsCatche.mm1.getValue()).toBe(2);
		MapCache.resetMapDepParser();
		mapsCatche.mm1.shouldCheckCache();
		expect(mapsCatche.mm1.getValue()).toBe(NaN);
	})
})
