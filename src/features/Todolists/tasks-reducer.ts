import {addTodolistTC, deleteTodolistTC, getTodolistsTC, RESULT_CODE} from "./todolist-reducer";
import {todolistAPI} from "api/todolist-api";
import {RequestStatusType} from "features/Application/application-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutTC} from "../Auth/auth-reducer";
import {appActions} from "features/Application";
import {AppRootStateType, ThunkErrorType} from "utils/types";
import {TaskPayloadType, TaskType} from "api/types";

const {setAppStatusAC} = appActions;

//Thunks

export const setTasksTC = createAsyncThunk<{ todolistId: string, tasks: Array<TaskType> }, string, ThunkErrorType>('tasks/setTasksTC', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.getTasks(todolistId);
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
        return {todolistId, tasks: res.data.items}
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    }
})

export const addTaskTC = createAsyncThunk<{ task: TaskType }, { todolistId: string, title: string }, ThunkErrorType>('tasks/addTaskTC', async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
        try {
            const res = await todolistAPI.addTask(param.todolistId, param.title)
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
                return {task: res.data.data.item}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI, false);
            }
        } catch (error) {
            const err = error as Error | AxiosError;
            return handleAsyncServerNetworkError(err, thunkAPI);
        }
    }
)

export const deleteTaskTC = createAsyncThunk<{ taskId: string, todolistId: string }, { todolistId: string, taskId: string }, ThunkErrorType>('tasks/deleteTaskTC', (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    thunkAPI.dispatch(updateTaskAC({
        todolistId: param.todolistId, taskId: param.taskId, model: {
            entityStatus: "loading"
        }
    }));
    try {
        const res = todolistAPI.deleteTask(param.todolistId, param.taskId);
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    } finally {
        thunkAPI.dispatch(updateTaskAC({
            todolistId: param.todolistId, taskId: param.taskId, model: {
                entityStatus: "failed"
            }
        }));
    }
})

export const updateTaskTC = createAsyncThunk<{ todolistId: string, taskId: string, model: TaskPayloadUpdateType }, { todolistId: string, taskId: string, model: TaskPayloadUpdateType }, ThunkErrorType>('tasks/updateTaskTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(updateTaskAC({
        todolistId: param.todolistId, taskId: param.taskId, model:
            {
                entityStatus: "loading"
            }
    }));
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}));
    try {
        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
        if (!task) {
            return thunkAPI.rejectWithValue({errors: ['Task not found']});
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
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            return param
        }

    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    } finally {
        thunkAPI.dispatch(updateTaskAC({
            todolistId: param.todolistId, taskId: param.taskId, model:
                {
                    entityStatus: "failed"
                }
        }));
    }
})

export const slice = createSlice({
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
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
            .addCase(deleteTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(getTodolistsTC.fulfilled, (state, action) => {
                action.payload.forEach(tl => {
                    state[tl.id] = [];
                })
            })
            .addCase(logoutTC.fulfilled, () => {
                return {};
            })
            .addCase(setTasksTC.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
            })
            .addCase(addTaskTC.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
            })
            .addCase(deleteTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index > -1) {
                    tasks.splice(index, 1)
                }
            })
            .addCase(updateTaskTC.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model, entityStatus: "succeeded"}
                }
            });
    }
})

//Actions

const {updateTaskAC} = slice.actions

export const asyncTasksActions = {addTaskTC, deleteTaskTC, updateTaskTC}

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

