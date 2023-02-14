import {todolistAPI, TodoListType} from "api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios, {AxiosError} from "axios";
import {setTasksTC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutTC} from "../Login/auth-reducer";

//Thunks

export const getTodolistsTC = createAsyncThunk('todolists/getTodolistsTC', async (param, {
        dispatch,
        rejectWithValue
    }) => {
        dispatch(setAppStatusAC({status: "loading"}));
        try {
            const res = await todolistAPI.getTodolist()
            dispatch(setAppStatusAC({status: "succeeded"}));
            const todolists = res.data;
            const setTasks = (todolists: Array<TodoListType>) => {
                todolists.forEach(tl => {
                    dispatch(setTasksTC(tl.id));
                })
            }
            setTasks(todolists);
            return todolists;
        } catch
            (e) {
            if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
                handleServerNetworkError(e, dispatch);
            }
            return rejectWithValue(null);
        }
    }
)

export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolistTC', async (id: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id, entityStatus: "loading"}));
    try {
        const res = await todolistAPI.deleteTodolist(id)

        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setAppStatusAC({status: "succeeded"}));
            return {todolistId: id}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
        return rejectWithValue(null);
    } finally {
        dispatch(changeTodolistEntityStatusAC({id, entityStatus: "failed"}));
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolistTC', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.addTodolist(title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setAppStatusAC({status: "succeeded"}));
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
        return rejectWithValue(null);
    }
})

export const updateTodolistTC = createAsyncThunk('todolists/updateTodolistTC', async (param: { id: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(changeTodolistEntityStatusAC({id: param.id, entityStatus: "loading"}));
    try {
        const res = await todolistAPI.updateTodolist(param.id, param.title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setAppStatusAC({status: "succeeded"}));
            return {title: param.title, id: param.id}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
        return rejectWithValue(null);
    } finally {
        dispatch(changeTodolistEntityStatusAC({id: param.id, entityStatus: "failed"}));
    }

})

const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodoListDomainType>,
    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].filter = action.payload.filter
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].entityStatus = action.payload.entityStatus
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(logoutTC.fulfilled, () => {
            return [];
        });
        builder.addCase(getTodolistsTC.fulfilled, (state, action) => {
            return action.payload.map(tl => ({...tl, filter: "all", entityStatus: "idle"}));
        });
        builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({
                ...action.payload.todolist, filter: 'all',
                entityStatus: 'idle'
            })
        });
        builder.addCase(updateTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index > -1) {
                state[index].title = action.payload.title
            }
        })
    }
})

export const todoListReducer = slice.reducer

// Actions

export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = slice.actions

export const todolistThunks = {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    getTodolistsTC, deleteTodolistTC, addTodolistTC, updateTodolistTC
}

//Types

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