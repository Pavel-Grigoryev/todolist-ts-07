import {AppRootStateType} from "../store";
import {TodoListDomainType} from "../reducers/todolist-reducer";


export const selectTodolists = (state: AppRootStateType): Array<TodoListDomainType> => state.todolists;