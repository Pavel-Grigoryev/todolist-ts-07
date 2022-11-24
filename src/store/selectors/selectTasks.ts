import {AppRootStateType} from "../index";
import {TasksStateType} from "../../App";



export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks;