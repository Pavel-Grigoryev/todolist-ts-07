import {AnyAction, combineReducers} from "redux";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {todolistReducer} from "features/Todolists";
import {tasksReducer} from "features/Todolists";
import {appReducer} from "./app-reducer";
import {authReducer} from "features/Auth";
import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger'
import {FieldErrorType} from "../api/todolist-api";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
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

export type ThunkErrorType = {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}

//@ts-ignore
window.store = store;