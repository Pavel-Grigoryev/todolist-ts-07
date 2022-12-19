import {addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "../actions";
import {TodoListType} from "../../api/todolist-api";
import {v1} from "uuid";

export type RemoveTodolistAT = ReturnType<typeof removeTodolistAC>

export type AddTodolistAT = ReturnType<typeof addTodolistAC>

type ChangeTodolistFilterAT = ReturnType<typeof changeTodolistFilterAC>

type ChangeTodolistTitleAT = ReturnType<typeof changeTodolistTitleAC>

type ActionsType = RemoveTodolistAT | AddTodolistAT | ChangeTodolistFilterAT | ChangeTodolistTitleAT


export let todolistId1 = v1();
export let todolistId2 = v1();


export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
};

export type FilterValuesType = "all" | "active" | "completed";

let initialState: Array<TodoListDomainType> = [
    /* {id: todolistId1, title: "What to learn", filter: "all"},
     {id: todolistId2, title: "What to buy", filter: "all"}*/
]

export const todoListReducer = (todolists = initialState, action: ActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.todolistId)
        case "ADD-TODOLIST":
            let newTodolist: TodoListDomainType =
                {
                    id: action.todolistId,
                    title: action.title,
                    filter: 'all',
                    addedDate: '',
                    order: 0
                };
            return [newTodolist, ...todolists]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(tl => tl.id === action.todolistId ? {...tl, filter: action.filter} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(tl => tl.id === action.todolistId ? {...tl, title: action.title} : tl);
        default:
            return todolists
    }
}


