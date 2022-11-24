import {tasksReducer} from "./reducers";
import {todoListReducer} from "./reducers";
import {combineReducers, compose, legacy_createStore} from "redux";


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = legacy_createStore(rootReducer, composeEnhancers());

export type AppRootStateType = ReturnType<typeof rootReducer>

//@ts-ignore
window.store = store;