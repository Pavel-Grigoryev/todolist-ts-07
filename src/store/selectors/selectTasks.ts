import {AppRootStateType} from "../store";
import {TasksStateType} from "../../app/App";



export const selectTasks = (state: AppRootStateType): TasksStateType => state.tasks;