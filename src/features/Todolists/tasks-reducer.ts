import {addTodolistAC, deleteTodolistAC, RESULT_CODE, setTodolistAC} from "./todolist-reducer";
import {TaskPayloadType, TaskType, todolistAPI} from "api/todolist-api";
import {AppRootStateType} from "app/store";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutTC} from "../Login/auth-reducer";

//Thunks

export const setTasksTC = createAsyncThunk('tasks/setTasksTC', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.getTasks(todolistId);
        dispatch(setAppStatusAC({status: "succeeded"}));
        return {todolistId, tasks: res.data.items}
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue({errors: [e.message], fieldsErrors: undefined});
        }
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTaskTC', async (param: { todolistId: string, title: string }, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.addTask(param.todolistId, param.title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setAppStatusAC({status: "succeeded"}));
            return {task: res.data.data.item}

        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    }
})

export const deleteTaskTC = createAsyncThunk('tasks/deleteTaskTC', (param: {todolistId: string, taskId: string}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(updateTaskAC({
        todolistId: param.todolistId, taskId: param.taskId, model: {
            entityStatus: "loading"
        }
    }));
    try {
        debugger
        const res = todolistAPI.deleteTask(param.todolistId, param.taskId);
        dispatch(setAppStatusAC({status: "succeeded"}));
       return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            debugger
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    } finally {
        dispatch(updateTaskAC({
            todolistId: param.todolistId, taskId: param.taskId, model: {
                entityStatus: "failed"
            }
        }));
    }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTaskTC', async (param: {todolistId: string, taskId: string, model: TaskPayloadUpdateType}, {dispatch, rejectWithValue, getState}) => {
    dispatch(updateTaskAC({
        todolistId: param.todolistId, taskId: param.taskId, model:
            {
                entityStatus: "loading"
            }
    }));
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const state = getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
        if (!task) {
            return rejectWithValue('Task not found');
        } else {

            const newModel: TaskPayloadType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...param.model
            }
            const res = await todolistAPI.updateTask(param.todolistId, param.taskId, newModel);
            dispatch(setAppStatusAC({status: "succeeded"}));

            return param
        }

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    } finally {
        dispatch(updateTaskAC({
            todolistId: param.todolistId, taskId: param.taskId, model:
                {
                    entityStatus: "failed"
                }
        }));
    }
})

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, model: TaskPayloadUpdateType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(deleteTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolistAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = [];
            })
        });
        builder.addCase(logoutTC.fulfilled, () => {
            return {};
        });
        builder.addCase(setTasksTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
            }
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
            }
        });
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            }
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            if (action.payload) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload?.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model, entityStatus: "succeeded"}
            }
            }
        });
    }
})

export const tasksReducer = slice.reducer

//Actions

export const {updateTaskAC} = slice.actions





export const tasksThunks = {addTaskTC, deleteTaskTC, updateTaskTC, updateTaskAC}

//Types

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

export type TaskPayloadUpdateType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
    entityStatus?: RequestStatusType
}

