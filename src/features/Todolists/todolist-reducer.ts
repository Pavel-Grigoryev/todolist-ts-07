import {todolistAPI, TodoListType} from "../../api/todolist-api";
import {AppThunk} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AxiosError} from "axios";
import {setTasksTC} from "./tasks-reducer";

let initialState: Array<TodoListDomainType> = []

export const todoListReducer = (state = initialState, action: TodolistActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            let newTodolist: TodoListDomainType =
                {
                    ...action.todolist,
                    filter: 'all',
                    entityStatus: 'idle'
                };
            return [newTodolist, ...state]
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl);
        case "TODOLIST/CHANGE-TODOLIST-ENTITY-STATYS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl);
        case "SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
        case "CLEAR-DATA":
            return [];
        default:
            return state
    }
}

// Actions

export const deleteTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const);

export const addTodolistAC = (todolist: TodoListType) => ({type: 'ADD-TODOLIST', todolist} as const);

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter: filter,
    todolistId: id
} as const);

export const changeTodolistTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title: title,
    todolistId: id
} as const);

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: 'TODOLIST/CHANGE-TODOLIST-ENTITY-STATYS', id, entityStatus
} as const);

export const setTodolistAC = (todolists: Array<TodoListType>) => ({type: 'SET-TODOLIST', todolists} as const);

export const clearTodosDataAC = () => {
    return {type: 'CLEAR-DATA'} as const
}

//Thunks

export const getTodolistsTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.getTodolist()
        .then((res) => {
                dispatch(setTodolistAC(res.data));
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
    dispatch(setAppStatusAC({status:"loading"}));
    dispatch(changeTodolistEntityStatusAC(id, "loading"));
    todolistAPI.deleteTodolist(id)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(deleteTodolistAC(id));
                    dispatch(setAppStatusAC({status: "succeeded"}));
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            }
        ).catch((err: AxiosError<{ message: string }>) => {
        handleServerNetworkError(err, dispatch);
    }).finally(() => {
        dispatch(changeTodolistEntityStatusAC(id, "failed"));
    })
}

export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    todolistAPI.addTodolist(title)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(addTodolistAC(res.data.data.item));
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
    dispatch(changeTodolistEntityStatusAC(id, "loading"));
    todolistAPI.updateTodolist(id, title)
        .then((res) => {
                if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                    dispatch(changeTodolistTitleAC(title, id));
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
            dispatch(changeTodolistEntityStatusAC(id, "failed"));
        })
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