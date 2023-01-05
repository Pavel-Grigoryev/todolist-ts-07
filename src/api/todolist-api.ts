import axios from 'axios'

const instance = axios.create ( {
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': '924cb8b4-087a-45b1-8c8f-f88504975a06'
    }
})

export const todolistAPI = {
    getTodolist () {
      return  instance.get<Array<TodoListType>>('todo-lists');
    },
    addTodolist (title: string) {
        return instance.post<CommonResponseType<{item : TodoListType}>>('todo-lists', {title});
    },
    deleteTodolist (id: string) {
        return  instance.delete<CommonResponseType>(`todo-lists/${id}`);
    },
    updateTodolist (id: string, title: string) {
        return  instance.put<CommonResponseType>(`todo-lists/${id}`,{title});
    },
    getTasks (todoListId: string) {
        return  instance.get<GetTasksResponseType>(`todo-lists/${todoListId}/tasks`);
    },
    deleteTask (todoListId: string, taskId: string) {
        return  instance.delete<CommonResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`);
    },
    addTask (todoListId: string, title: string) {
        return  instance.post<CommonResponseType<{item:TaskType}>>(`todo-lists/${todoListId}/tasks`, {title});
    },
    updateTask (todoListId: string, taskId: string, model: TaskPayloadType) {
        return  instance.put<CommonResponseType<{item:TaskType}>>(`todo-lists/${todoListId}/tasks/${taskId}`, model);
    }
}

export const authAPI = {
    login(data: AuthDataType) {
        return instance.post<CommonResponseType<{userId:number}>>('/auth/login', data);
    },
    logout() {
        return instance.delete<CommonResponseType>('/auth/login');
    },
    me() {
        return instance.get<CommonResponseType<MeResponseType>>('/auth/me');
    }
}

//Types

export type AuthDataType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha?: string
}

type MeResponseType = {
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

type GetTasksResponseType = {
    totalCount: number
    error: string
    items: Array<TaskType>
}

export type CommonResponseType <T = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
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