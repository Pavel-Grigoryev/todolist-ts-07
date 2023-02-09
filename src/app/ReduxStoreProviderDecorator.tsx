import {AppRootStateType} from "./store";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {ReactNode} from "react";
import {Provider} from "react-redux";
import React from "react";
import {v1} from "uuid";
import {TaskPriorities, TasksStatuses} from "api/todolist-api";
import {tasksReducer} from "features/Todolists/tasks-reducer";
import {todoListReducer} from "features/Todolists/todolist-reducer";
import {appReducer} from "./app-reducer";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "features/Login/auth-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState = {
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
        isInitialized: false
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunkMiddleware));

export type AppRootStoryBookStateType = ReturnType<typeof rootReducer>

export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

//@ts-ignore
window.storyBookStore = storyBookStore;

