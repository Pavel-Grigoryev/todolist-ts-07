import {AnyAction, combineReducers} from "redux";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {todoListReducer} from "features/Todolists/todolist-reducer";
import {tasksReducer} from "features/Todolists/tasks-reducer";
import {appReducer} from "./app-reducer";
import {authReducer} from "features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware).concat(logger)
})

//Types

export type RootReducerType = typeof rootReducer

export type AppRootStateType = ReturnType<RootReducerType>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>

//@ts-ignore
window.store = store;