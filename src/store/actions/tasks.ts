
export const removeTaskAC = (taskId: string, todoListId: string) => ({
    type: 'REMOVE-TASK',
    taskId,
    todoListId
}) as const;

export const addTaskAC = (title: string, todoListId: string) => ({type: 'ADD-TASK', todoListId, title}) as const;

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todoListId: string) => ({
    type: 'CHANGE-TASK-STATUS',
    isDone,
    todoListId,
    taskId
}) as const;

export const changeTaskTitleAC = (taskId: string, title: string, todoListId: string) => ({
    type: 'CHANGE-TASK-TITLE',
    title,
    todoListId,
    taskId
}) as const;