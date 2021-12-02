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

export const store = createStore(
	{name},
	{},
	{
		middlewares: [
			promiseMiddleware, 
			filterNonObjectMiddleware, 
			fillObjectRestDataMiddleware,
			shallowEqualMiddleware,
		]
	}
);
const inject = createInject({
	storeGetter: () => store,
	loadingComponent: () => <div role='loading'>loading</div>
});


const injector = inject(
	'name',
)
.watch('name', {state: ['text'], maps: ['textSplit']})

const Son = injector(({name}) => {
	React.useEffect(() => {
		name.actions.updateText('son name');
	}, []);
	return (
		<div>{name.state.text}</div>
	)
})

const App = injector(({name}) => {
	const { state, actions, maps } = name;
	return (
		<>
			<input role='name-input' value={state.text} onChange={e => actions.updateText(e.target.value)} />
			<br/>
			<button onClick={() => actions.inc(state.count)}>+</button>
			<span role='count'>{state.count + ''}</span>
			<span role='text-split'>{maps.textSplit}</span>
			<Son />
		</>
	);
});

export {
	App,
};
