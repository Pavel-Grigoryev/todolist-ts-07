import {TasksStatuses} from "../../api/todolist-api";

export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todoListId
}) as const;

export const addTaskAC = (todoListId: string, title: string) => ({type: 'ADD-TASK', todoListId, title}) as const;

export const changeTaskStatusAC = (taskId: string, status: TasksStatuses, todoListId: string) => ({
    type: 'CHANGE-TASK-STATUS',
    status,
    todoListId,
    taskId
}) as const;

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    title,
    todoListId,
    taskId
}) as const;