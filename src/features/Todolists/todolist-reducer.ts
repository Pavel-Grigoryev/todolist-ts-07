import {todolistAPI, TodoListType} from "../../api/todolist-api";
import {AppThunk} from "../../app/store";

let initialState: Array<TodoListDomainType> = []

export const todoListReducer = (state = initialState, action: TodolistActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            let newTodolist: TodoListDomainType =
                {
                    ...action.todolist,
                    filter: 'all'
                };
            return [newTodolist, ...state]
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl);
        case "SET-TODOLIST":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        default:
            return state
    }
}

// Actions

export const deleteTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const);

export const addTodolistAC = (todolist: TodoListType) => ({type: 'ADD-TODOLIST', todolist} as const);

export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter: filter,
    todolistId: id
} as const);

export const changeTodolistTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    title: title,
    todolistId: id
} as const);

export const setTodolistAC = (todolists: Array<TodoListType>) => ({type: 'SET-TODOLIST', todolists} as const);

//Thunks

export const getTodolistsTC = (): AppThunk => (dispatch) => {
    todolistAPI.getTodolist()
        .then((res) => {
                dispatch(setTodolistAC(res.data));
            }
        )
}

export const deleteTodolistTC = (id: string): AppThunk => (dispatch) => {
    todolistAPI.deleteTodolist(id)
        .then((res) => {
                dispatch(deleteTodolistAC(id));
            }
        )
}

export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    todolistAPI.addTodolist(title)
        .then((res) => {
                dispatch(addTodolistAC(res.data.data.item));
            }
        )
}

export const updateTodolistTC = (id: string, title: string): AppThunk => (dispatch) => {
    todolistAPI.updateTodolist(id, title)
        .then((res) => {
                dispatch(changeTodolistTitleAC(title, id));
            }
        )
}


//Types

export type DeleteTodolistAT = ReturnType<typeof deleteTodolistAC>

export type AddTodolistAT = ReturnType<typeof addTodolistAC>

type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>

export type SetTodolistAT = ReturnType<typeof setTodolistAC>


export type TodolistActionsType =
    DeleteTodolistAT
    | AddTodolistAT
    | ChangeTodolistFilterAT
    | ChangeTodolistTitleAT
    | SetTodolistAT

export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
};

export type FilterValuesType = "all" | "active" | "completed";