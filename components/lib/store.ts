import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

interface IAction {
	type: string;
	payload?: any;
	ts?: number;
}

interface ITickAction extends IAction {
	light: boolean;
}

type TDispatch = (action: ITickAction | IAction) => void;

const exampleInitialState = {
	lastUpdate: 0,
	light: 0,
	count: 0,
};

export const actionTypes: { [key: string]: string } = {
	ADD: 'ADD',
	TICK: 'TICK',
};

// REDUCERS
export const reducer = (state = exampleInitialState, action: IAction) => {
	switch (action.type) {
		case actionTypes.TICK:
			return Object.assign({}, state, {
				lastUpdate: action.ts,
				light: !!action.payload,
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
export const serverRenderCheck = (isServer: boolean) => (dispatch: TDispatch) =>
	dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() });

export const startClock = () => (dispatch: TDispatch) => {
	return setInterval(() => dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() }), 800);
};

export const addCount = () => (dispatch: TDispatch) => {
	return dispatch({ type: actionTypes.ADD });
};

export const initStore = (initialState = exampleInitialState) => {
	return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
};
