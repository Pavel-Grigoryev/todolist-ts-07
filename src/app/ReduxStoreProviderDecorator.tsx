import {AppRootStateType} from "./store";
import {combineReducers, legacy_createStore} from "redux";
import {ReactNode} from "react";
import {Provider} from "react-redux";
import React from "react";
import {v1} from "uuid";
import { reducer as formReducer } from 'redux-form';
import {TaskPriorities, TasksStatuses} from "../api/todolist-api";
import {tasksReducer} from "../features/Todolists/tasks-reducer";
import {todoListReducer} from "../features/Todolists/todolist-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListReducer,
    form: formReducer
})

const initialGlobalState = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: "todolistId2", title: "What to buy", filter: "all", addedDate: "", order: 0}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: ''},
            {id: v1(), title: "JS", status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: ''}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: ''},
            {id: v1(), title: "React Book", status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: ''}
        ]
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export type AppRootStoryBookStateType = ReturnType<typeof rootReducer>

export const ReduxStoreProviderDecorator = (storyFn: () => ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

//@ts-ignore
window.storyBookStore = storyBookStore;

