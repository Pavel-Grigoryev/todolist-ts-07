import {AddTodolistAT, DeleteTodolistAT, SetTodolistAT} from "./todolist-reducer";
import {TaskPayloadType, TaskType, todolistAPI} from "../../api/todolist-api";
import {AppThunk} from "../store";

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
                [action.task.todoListId]: [{
                    ...action.task
                }, ...state[action.task.todoListId]]
            }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {
                    ...t,
                    ...action.model
                } : t)
            }
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todolist.id]: []
            }
        case "REMOVE-TODOLIST":
            let copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        case "SET-TODOLIST": {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = [];
            })
            return copyState;
        }
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
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

export const setTasksTC = (todolistId: string): AppThunk => (dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(todolistId, res.data.items))
        })
}

export const addTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.addTask(todolistId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}

export const updateTaskTC = (todolistId: string, taskId: string, model: TaskPayloadUpdateType): AppThunk => (dispatch, getState) => {
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

        todolistAPI.updateTask(todolistId, taskId, newModel)
            .then((res) => {
                dispatch(updateTaskAC(todolistId, taskId, newModel))
            })
    }
}

//Types

export type TasksStateType = {
    [key: string]: Array<TaskType>
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
    | setTasksAT


export type TaskPayloadUpdateType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
