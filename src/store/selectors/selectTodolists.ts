import {AppRootStateType} from "../index";
import {TodolistType} from "../../App";


export const selectTodolists = (state: AppRootStateType): Array<TodolistType> => state.todolists;