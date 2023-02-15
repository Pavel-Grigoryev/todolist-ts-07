import {asyncTasksActions, tasksSlice} from './tasks-reducer'
import {asyncTodolistActions, todolistsSlice} from './todolist-reducer'
import {Todolists} from './Todolists'
import * as todolistSelectors from './todolist-selectors'

const tasksActions = {
    ...asyncTasksActions,
    ...tasksSlice
}

const todolistActions = {
    ...asyncTodolistActions,
    ...todolistsSlice
}

export {
    tasksActions,
    todolistActions,
    Todolists,
    todolistSelectors
}