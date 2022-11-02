import {FilterValuesType, TodolistType} from "../App";



type RemoveTodolistAT = {
   type: 'REMOVE-TODOLIST'
   todolistId: string
}

type AddTodolistAT = {
   type: 'ADD-TODOLIST'
   title: string
   todolistId: string
}

type ChangeTodolistFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValuesType
    todolistId: string
}

type ChangeTodolistTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    todolistId: string
}





type ActionsType = RemoveTodolistAT |  AddTodolistAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT



export const todoListReducer = (todolists: Array<TodolistType>, action: ActionsType): Array<TodolistType>  => {
   switch (action.type) {
      case "REMOVE-TODOLIST":
         return todolists.filter(tl => tl.id != action.todolistId)
      case "ADD-TODOLIST":
         let newTodolist: TodolistType =
             {
                id: action.todolistId,
                title: action.title,
                filter: 'all'
             };
         return [ ...todolists, newTodolist]
       case "CHANGE-TODOLIST-FILTER":
           return todolists.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter}: tl)
       case "CHANGE-TODOLIST-TITLE":
           return todolists.map(tl => tl.id === action.todolistId ? {...tl, title: action.title}: tl);
       default:
         return todolists
   }
}

export const RemoveTodolistAC = (id: string):RemoveTodolistAT => ({type: 'REMOVE-TODOLIST', todolistId: id});
export const AddTodolistAC = (title: string, id: string):AddTodolistAT => ({type: 'ADD-TODOLIST', title: title, todolistId: id});
export const ChangeTodolistFilterAC = (filter: FilterValuesType, id: string):ChangeTodolistFilterAT => ({type: 'CHANGE-TODOLIST-FILTER', filter: filter, todolistId: id});
export const ChangeTodolistTitleAC = (title: string, id: string):ChangeTodolistTitleAT => ({type: 'CHANGE-TODOLIST-TITLE', title: title, todolistId: id});
