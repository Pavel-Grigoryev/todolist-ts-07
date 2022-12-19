import {FilterValuesType} from "../reducers/todolist-reducer";
import {v1} from "uuid";


export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId}) as const;
export const addTodolistAC = (title: string) => ({type: 'ADD-TODOLIST', title: title, todolistId:v1()}) as const;
export const changeTodolistFilterAC = (filter: FilterValuesType, id: string) => ({type: 'CHANGE-TODOLIST-FILTER', filter: filter, todolistId: id}) as const;
export const changeTodolistTitleAC = (title: string, id: string) => ({type: 'CHANGE-TODOLIST-TITLE', title: title, todolistId: id}) as const;