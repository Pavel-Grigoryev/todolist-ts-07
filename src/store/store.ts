import {tasksReducer} from "./reducers";
import {todoListReducer} from "./reducers";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TodolistActionsType} from "./reducers/todolist-reducer";
import {useDispatch} from "react-redux";
import {TasksActionsType} from "./reducers/tasks-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));

//Custom hooks

export const appDispatch = () => useDispatch<AppDispatchType>();

//Types

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, ActionTypes>

export type ActionTypes = TodolistActionsType | TasksActionsType

type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, ActionTypes>

//@ts-ignore
window.store = store;