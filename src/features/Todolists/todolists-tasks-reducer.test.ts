import {addTodolistAC, TodoListDomainType, todoListReducer} from "./todolist-reducer";
import {tasksReducer, TasksStateType} from "./tasks-reducer";


test('ids should be equals', () => {
    const startTasksState: TasksStateType = {}
    const startTodolistsState: Array<TodoListDomainType> = []

    const action = addTodolistAC({id: 'todolistId1', title: "What to learn", addedDate: "", order: 0})

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})