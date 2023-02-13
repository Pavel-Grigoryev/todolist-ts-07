import {
    addTodolistAC,
    AddTodolistAT,
    deleteTodolistAC,
    DeleteTodolistAT,
    RESULT_CODE,
    setTodolistAC,
    SetTodolistAT
} from "./todolist-reducer";
import {TaskPayloadType, TaskType, todolistAPI} from "api/todolist-api";
import {AppThunk} from "app/store";
import {RequestStatusType, setAppStatusAC} from "app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios, {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutTC} from "../Login/auth-reducer";

export let initialState: TasksStateType = {};

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: "idle"})
        },
        updateTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string, model: TaskPayloadUpdateType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{ todolistId: string, tasks: Array<TaskType> }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
        },
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
        })
        builder.addCase(logoutTC.fulfilled, () => {
            return {};
        })
    }
})

export const tasksReducer = slice.reducer

//Actions

export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions

//Thunks

export const setTasksTC = (todolistId: string): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.getTasks(todolistId);
        dispatch(setTasksAC({todolistId, tasks: res.data.items}));
        dispatch(setAppStatusAC({status: "succeeded"}));
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    }

}

export const addTaskTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.addTask(todolistId, title)
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(addTaskAC({task: res.data.data.item}));
            dispatch(setAppStatusAC({status: "succeeded"}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {

    }
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(updateTaskAC({
        todolistId, taskId, model: {
            entityStatus: "loading"
        }
    }));
    try {
        const res = todolistAPI.deleteTask(todolistId, taskId);
        dispatch(removeTaskAC({taskId, todolistId}));
        dispatch(setAppStatusAC({status: "succeeded"}));

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(updateTaskAC({
            todolistId, taskId, model: {
                entityStatus: "failed"
            }
        }));
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, model: TaskPayloadUpdateType): AppThunk => async (dispatch, getState) => {
    dispatch(updateTaskAC({
        todolistId, taskId, model:
            {
                entityStatus: "loading"
            }
    }));
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const task = getState().tasks[todolistId].find(t => t.id === taskId);
        if (!task) {
            console.warn('Task not found')
        } else {

            const newModel: TaskPayloadType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...model
            }
            const res = await todolistAPI.updateTask(todolistId, taskId, newModel);
            dispatch(updateTaskAC({todolistId, taskId, model: newModel}));
            dispatch(setAppStatusAC({status: "succeeded"}));
            dispatch(updateTaskAC({
                todolistId, taskId, model:
                    {
                        entityStatus: "succeeded"
                    }
            }))
            ;
        }

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(updateTaskAC({
            todolistId, taskId, model:
                {
                    entityStatus: "failed"
                }
        }));
    }

}

export const tasksThunks = {addTaskTC, deleteTaskTC, updateTaskTC, removeTaskAC, addTaskAC, updateTaskAC, setTasksAC}

//Types

export type TaskDomainType = TaskType & {
    entityStatus: RequestStatusType
}

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type updateTaskAT = ReturnType<typeof updateTaskAC>
type setTasksAT = ReturnType<typeof setTasksAC>


export type TasksActionsType =
    RemoveTaskAT
    | AddTaskAT
    | updateTaskAT
    | AddTodolistAT
    | DeleteTodolistAT
    | SetTodolistAT
    | setTasksAT;

export type TaskPayloadUpdateType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
    entityStatus?: RequestStatusType
}

