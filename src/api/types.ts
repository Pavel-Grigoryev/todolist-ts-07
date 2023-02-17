export type AuthDataType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: string
}

export type MeResponseType = {
    id: number
    email: string
    login: string
}

export enum TasksStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TodoListType = {
    id: string
    addedDate: string
    order: number
    title: string
}

export type TaskType = {
    description: string
    title: string
    status: TasksStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type GetTasksResponseType = {
    totalCount: number
    error: string
    items: Array<TaskType>
}

export type FieldErrorType = {
    field: string
    error: string
}

export type CommonResponseType <T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors?: Array<FieldErrorType>
    data: T
}

export type TaskPayloadType = {
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}