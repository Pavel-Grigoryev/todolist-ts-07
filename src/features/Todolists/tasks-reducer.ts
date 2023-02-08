import {
    addTodolistAC,
    AddTodolistAT, clearTodosDataAC,
    ClearTodosDataAT, deleteTodolistAC,
    DeleteTodolistAT,
    RESULT_CODE, setTodolistAC,
    SetTodolistAT
} from "./todolist-reducer";
import {TaskPayloadType, TaskType, todolistAPI} from "../../api/todolist-api";
import {AppThunk} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";

export let initialState: TasksStateType = {};


export const tasksReducer = (state = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        case "ADD-TASK":
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: "idle"}, ...state[action.task.todoListId]]
            }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                    ...t,
                    ...action.model
                } : t)
            }
        case addTodolistAC.type:
            return {
                ...state,
                [action.payload.todolist.id]: []
            }
        case deleteTodolistAC.type:
            let copyState = {...state}
            delete copyState[action.payload.todolistId]
            return copyState
        case setTodolistAC.type: {
            const copyState = {...state}
            action.payload.todolists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState;
        }
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks.map(t => ({...t, entityStatus: "idle"}))};
        case clearTodosDataAC.type:
            return {};
        default:
            return state
    }
}

//Actions

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todoListId
}) as const;

export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const;

export const updateTaskAC = (todoListId: string, taskId: string, model: TaskPayloadUpdateType) => ({
    type: 'UPDATE-TASK',
    todoListId,
    taskId,
    model
}) as const;

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: 'SET-TASKS',
    todolistId,
    tasks
}) as const;

//Thunks

export const setTasksTC = (todolistId: string): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}));
    try {
        const res = await todolistAPI.getTasks(todolistId);
        dispatch(setTasksAC(todolistId, res.data.items));
        dispatch(setAppStatusAC({status:"succeeded"}));
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
            dispatch(addTaskAC(res.data.data.item));
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
    dispatch(updateTaskAC(todolistId, taskId,{entityStatus: "loading"}));
    try {
        const res = todolistAPI.deleteTask(todolistId, taskId);
        dispatch(removeTaskAC(taskId, todolistId));
        dispatch(setAppStatusAC({status: "succeeded"}));

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(updateTaskAC(todolistId, taskId,{entityStatus: "failed"}));
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, model: TaskPayloadUpdateType): AppThunk => async (dispatch, getState) => {
    dispatch(setAppStatusAC({status: "loading"}));
    dispatch(updateTaskAC(todolistId, taskId,{entityStatus: "loading"}));
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
            dispatch(updateTaskAC(todolistId, taskId, newModel));
            dispatch(setAppStatusAC({status:"succeeded"}));
            dispatch(updateTaskAC(todolistId, taskId,{entityStatus: "succeeded"}));
        }

    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(updateTaskAC(todolistId, taskId,{entityStatus: "failed"}));
    }

}

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


export type TasksActionsType = RemoveTaskAT | AddTaskAT | updateTaskAT | AddTodolistAT | DeleteTodolistAT | SetTodolistAT | setTasksAT | ClearTodosDataAT;

export type TaskPayloadUpdateType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
    entityStatus?: RequestStatusType
}

