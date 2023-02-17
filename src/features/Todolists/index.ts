import {asyncTasksActions, slice as tasksSlice } from './tasks-reducer'
import {asyncTodolistActions, slice as todolistsSlice} from './todolist-reducer'
import {Todolists} from './Todolists'
import * as todolistSelectors from './todolist-selectors'
import * as tasksSelectors from './tasks-selectors'

const tasksReducer = tasksSlice.reducer;
const todolistReducer = todolistsSlice.reducer;

const tasksActions = {
    ...asyncTasksActions,
    ...tasksSlice.actions
}

const todolistActions = {
    ...asyncTodolistActions,
    ...todolistsSlice.actions
}

export {
    tasksActions,
    todolistActions,
    Todolists,
    todolistSelectors,
    tasksSelectors,
    tasksReducer,
    todolistReducer
}