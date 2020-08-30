import { createStore, applyMiddleware, compose  } from 'redux';
import reducers from './CombinedReducers';
import thunk from "redux-thunk";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    reducers, {},
    composeEnhancers(
        applyMiddleware(thunk))
    )
