import {combineReducers} from "redux";
import thunkMiddleware from "redux-thunk";
import {tasksReducer, todolistReducer} from "features/Todolists";
import {authReducer} from "features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger'
import {applicationReducer} from "../features/Application";

export const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    auth: authReducer,
    app: applicationReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware).concat(logger)
})

//@ts-ignore
window.store = store;