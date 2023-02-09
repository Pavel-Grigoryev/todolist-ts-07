import {todolistAPI, TodoListType} from "api/todolist-api";
import {AppThunk} from "app/store";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {setTasksTC} from "./tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

let initialState: Array<TodoListDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        deleteTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodoListType }>) {
            state.unshift({
                ...action.payload.todolist, filter: 'all',
                entityStatus: 'idle'
            })
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].title = action.payload.title
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].entityStatus = action.payload.entityStatus
            }
        },
        setTodolistAC(state, action: PayloadAction<{ todolists: Array<TodoListType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
        },
        clearTodosDataAC() {
            return []
        }
    }
})

export const todoListReducer = slice.reducer

// Actions

export const {
    deleteTodolistAC,
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    changeTodolistEntityStatusAC,
    setTodolistAC,
    clearTodosDataAC
} = slice.actions

//Thunks

export const getTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.getTodolist()
        .then((res) => {
                dispatch(setTodolistAC({todolists: res.data}));
                dispatch(setAppStatusAC({status: "succeeded"}));
                return res.data;
            }
        ).then((todolists) => {
            todolists.forEach(tl => {
                dispatch(setTasksTC(tl.id));
            })
        }
    )
        .catch((err: AxiosError<{ message: string }>) => {
            handleServerNetworkError(err, dispatch);
        })
}

export const deleteTodolistTC = (id: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id, entityStatus: "loading"}));
    todolistAPI.deleteTodolist(id)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(deleteTodolistAC({todolistId: id}));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            }
        ).catch((err: AxiosError<{ message: string }>) => {
        handleServerNetworkError(err, dispatch);
    }).finally(() => {
        dispatch(changeTodolistEntityStatusAC({id, entityStatus: "failed"}));
    })
}

export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.addTodolist(title)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            }
        )
        .catch((err: AxiosError<{ message: string }>) => {
            handleServerNetworkError(err, dispatch);
        })
}

export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id, entityStatus: "loading"}));
    todolistAPI.updateTodolist(id, title)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(changeTodolistTitleAC({title, id}));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            }
        )
        .catch((err: AxiosError<{ message: string }>) => {
            handleServerNetworkError(err, dispatch);
        })
        .finally(() => {
            dispatch(changeTodolistEntityStatusAC({id, entityStatus: "failed"}));
        })
}

export const todolistThunks = {
    deleteTodolistAC,
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    changeTodolistEntityStatusAC,
    setTodolistAC,
    clearTodosDataAC, getTodolistsTC, deleteTodolistTC, addTodolistTC, updateTodolistTC
}

//Types

export type DeleteTodolistAT = ReturnType<typeof deleteTodolistAC>;
export type AddTodolistAT = ReturnType<typeof addTodolistAC>;
type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>;
type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>;
export type SetTodolistAT = ReturnType<typeof setTodolistAC>;
export type ChangeTodolistEntityStatusAT = ReturnType<typeof changeTodolistEntityStatusAC>;
export type ClearTodosDataAT = ReturnType<typeof clearTodosDataAC>;


export type TodolistActionsType =
    DeleteTodolistAT
    | AddTodolistAT
    | ChangeTodolistFilterAT
    | ChangeTodolistTitleAT
    | SetTodolistAT
    | ChangeTodolistEntityStatusAT
    | ClearTodosDataAT;

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
};

export type FilterValuesType = "all" | "active" | "completed";

export enum RESULT_CODE {
    SUCCESS,
    ERROR,
    CAPTCHA = 10
}