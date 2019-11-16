import { createStore, applyMiddleware, Action, Dispatch } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const exampleInitialState = {
	lastUpdate: 0,
	light: false,
	count: 0,
};

export const actionTypes = {
	ADD: 'ADD',
	TICK: 'TICK',
};

// REDUCERS
export const reducer = (state = exampleInitialState, action: any) => {
	switch (action.type) {
		case actionTypes.TICK:
			return Object.assign({}, state, {
				lastUpdate: action.ts,
				light: !!action.light,
			});
		case actionTypes.ADD:
			return Object.assign({}, state, {
				count: state.count + 1,
			});
		default:
			return state;
	}
};

// ACTIONS
export const serverRenderClock = (isServer: boolean) => (dispatch: Dispatch) => {
	return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() });
};

export const startClock = () => (dispatch: Dispatch) => {
	return setInterval(() => dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() }), 800);
};

export const addCount = () => (dispatch: Dispatch) => {
	return dispatch({ type: actionTypes.ADD });
};

export const initStore = (initialState = exampleInitialState) => {
	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
};
