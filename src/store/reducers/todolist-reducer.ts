import {TodolistType} from "../../App";
import {v1} from "uuid";
import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "../actions";

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>

export type AddTodolistAT = ReturnType<typeof addTodolistAC>

type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

type ChangeTodolistTitleAT =  ReturnType<typeof changeTodolistTitleAC>

type ActionsType = RemoveTodolistAT |  AddTodolistAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT

export let todolistId1 = v1();
export let todolistId2 = v1();

let initialState: Array<TodolistType> = [
    {id: todolistId1, title: "What to learn", filter: "all"},
    {id: todolistId2, title: "What to buy", filter: "all"}
]

export const todoListReducer = (todolists = initialState, action: ActionsType): Array<TodolistType>  => {
   switch (action.type) {
      case "REMOVE-TODOLIST":
         return todolists.filter(tl => tl.id !== action.todolistId)
      case "ADD-TODOLIST":
         let newTodolist: TodolistType =
             {
                id: action.todolistId,
                title: action.title,
                filter: 'all'
             };
         return [ newTodolist, ...todolists ]
       case "CHANGE-TODOLIST-FILTER":
           return todolists.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter}: tl)
       case "CHANGE-TODOLIST-TITLE":
           return todolists.map(tl => tl.id === action.todolistId ? {...tl, title: action.title}: tl);
       default:
         return todolists
   }
}


