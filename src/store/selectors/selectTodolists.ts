import {AppRootStateType} from "../index";
import {TodoListDomainType} from "../reducers/todolist-reducer";


export const selectTodolists = (state: AppRootStateType): Array<TodoListDomainType> => state.todolists;