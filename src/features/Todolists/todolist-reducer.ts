import {todolistAPI, TodoListType} from "api/todolist-api";
import {RequestStatusType} from "app/app-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {setTasksTC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutTC} from "../Auth/auth-reducer";
import {appActions} from "app";
import {ThunkErrorType} from "app/store";

const { setAppStatusAC } = appActions;

//Thunks

export const getTodolistsTC = createAsyncThunk<Array<TodoListType>, undefined, ThunkErrorType>('todolists/getTodolistsTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.getTodolist()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
        const todolists = res.data;
        const setTasks = (todolists: Array<TodoListType>) => {
            todolists.forEach(tl => {
                thunkAPI.dispatch(setTasksTC(tl.id));
            })
        }
        setTasks(todolists);
        return todolists;
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    }
})

export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodolistTC', async (id: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id, entityStatus: "loading"}));
    try {
        const res = await todolistAPI.deleteTodolist(id)

        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            return {todolistId: id}
        } else {
            handleAsyncServerAppError(res.data, thunkAPI);
        }
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    } finally {
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id, entityStatus: "failed"}));
    }
})

export const addTodolistTC = createAsyncThunk<{ todolist: TodoListType }, string, ThunkErrorType>('todolists/addTodolistTC', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.addTodolist(title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            return {todolist: res.data.data.item}
        } else {
            handleAsyncServerAppError(res.data, thunkAPI, false);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors});
        }
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    }
})

export const updateTodolistTC = createAsyncThunk('todolists/updateTodolistTC', async (param: { id: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.id, entityStatus: "loading"}));
    try {
        const res = await todolistAPI.updateTodolist(param.id, param.title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            return {title: param.title, id: param.id}
        } else {
            handleAsyncServerAppError(res.data, thunkAPI);
        }
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    } finally {
        thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.id, entityStatus: "failed"}));
    }

})

export const slice = createSlice({
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

// Actions

export const {changeTodolistEntityStatusAC} = slice.actions

export const asyncTodolistActions = {
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