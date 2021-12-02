import React from "react";
import { createInject, createStore } from "../../src";
import {
	promiseMiddleware,
	filterNonObjectMiddleware,
	fillObjectRestDataMiddleware,
	shallowEqualMiddleware
} from '../../src/middlewares'

const name = {
	state: {
		text: 'name',
		count: 0,
	},
	actions: {
		updateText: (text: string) => ({text}),
		inc: (count: number) => ({count: count + 1}),
	},
	maps: {
		textSplit: ['text', (text: string) => text.split('').join(',')],
		firstChar: ['text', (text: string) => text[0]],
	}
}
const lazyName = {
	state: {
		text: 'name',
	},
	actions: {
		updateText: (text: string) => ({text}),
	},
	maps: {
		textSplit: ['text', (text: string) => text.split('').join(',')],
	}
}

export const store = createStore(
	{name},
	{
		lazyName: () => new Promise<typeof lazyName>(res => {
			setTimeout(() => {
				res(lazyName);
			}, 500);
		}),
		lazyLoadError: () => Promise.reject(lazyName),
	},
	{
		middlewares: [
			promiseMiddleware, 
			filterNonObjectMiddleware, 
			fillObjectRestDataMiddleware,
			shallowEqualMiddleware,
		]
	}
);
const Inject = createInject({
	storeGetter: () => store,
	loadingComponent: () => <>loading</>
});


const name1Injector = Inject('name1' as any);

const App = name1Injector(({name1}) => {
	return (
		<div role='app'>
			app
			<div role='name'>{String(name1)}</div>
		</div>
	);
});

export {
	App,
};
