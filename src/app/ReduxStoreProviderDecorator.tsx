import {combineReducers} from "redux";
import React, {ReactNode} from "react";
import {Provider} from "react-redux";
import {v1} from "uuid";
import {TaskPriorities, TasksStatuses} from "api/types";
import {tasksReducer} from "features/Todolists";
import {todolistReducer} from "features/Todolists";
import thunkMiddleware from "redux-thunk";
import {HashRouter} from "react-router-dom";
import {configureStore} from "@reduxjs/toolkit";
import {RootReducerType} from "utils/types";
import {authReducer} from "features/Auth";
import {applicationReducer} from "../features/Application";

const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: applicationReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStoryBookStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: 'idle'},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: 'loading'}
    ],
    tasks: {
        ["todolistId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: v1(), title: "JS", status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            }
        ],
        ["todolistId2"]: [
            {
                id: v1(), title: "Milk", status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: v1(), title: "React Book", status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "loading"
            }
        ]
    },
    app: {
        status: 'idle',
        error: null,
        isInitialized: true
    },
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export type AppRootStoryBookStateType = ReturnType<typeof rootReducer>

export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

export const BrowserRouterDecorator = (storyFn: () => ReactNode) => {
    return <HashRouter>{storyFn()}</HashRouter>
}

//@ts-ignore
window.storyBookStore = storyBookStore;

