import {
    addTaskTC,
    deleteTaskTC,
    setTasksTC,
    tasksReducer,
    TasksStateType,
    tasksSlice,
} from "./tasks-reducer";
import {TaskPriorities, TasksStatuses, TodoListType} from "api/todolist-api";
import {addTodolistTC, deleteTodolistTC, getTodolistsTC} from "./todolist-reducer";
import {logoutTC} from "../Auth/auth-reducer";

let startState: TasksStateType;
let startTodolists: Array<TodoListType>;

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '2', title: 'JS', status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'React', status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '2', title: 'milk', status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'tea', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            }
        ]
    }

    startTodolists = [
        {id: '1', title: "What to learn", addedDate: "", order: 0},
        {id: '2', title: "What to buy", addedDate: "", order: 0}
    ]
})

test('correct task should be deleted from correct array', () => {

    const action = deleteTaskTC.fulfilled({taskId: '2', todolistId: 'todolistId2'}, 'requestId', {taskId: '2', todolistId: 'todolistId2'} )

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {
                id: '1', title: 'CSS', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '2', title: 'JS', status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'React', status: TasksStatuses.Completed,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            },
            {
                id: '3', title: 'tea', status: TasksStatuses.New,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                description: '',
                entityStatus: "idle"
            }
        ]
    })
})


test('correct task should be added to correct array', () => {

    const newTask = {
        id: '4', title: 'beer',
        status: TasksStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId2',
        order: 0,
        addedDate: '',
        description: '',
        entityStatus: "idle"
    }

    const action = addTaskTC.fulfilled({task: newTask}, 'requestId', {todolistId: 'todolistId2', title: 'beer' } )

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('beer')
    expect(endState['todolistId2'][0].status).toBe(TasksStatuses.New)
})

test('entityStatus of specified task should be changed', () => {

    const action = tasksSlice.updateTaskAC({
        todolistId: 'todolistId2', taskId: '2', model:
            {
                entityStatus: "loading"
            }
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].entityStatus).toBe("idle");
    expect(endState['todolistId2'][1].entityStatus).toBe("loading");
})

test('status of specified task should be changed', () => {

    const action = tasksSlice.updateTaskAC({
        todolistId: 'todolistId2', taskId: '2', model:
            {
                status: TasksStatuses.New
            }
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].status).toBe(TasksStatuses.Completed);
    expect(endState['todolistId2'][1].status).toBe(TasksStatuses.New);
})


test('title of specified task should be changed', () => {

    const action = tasksSlice.updateTaskAC({
        todolistId: 'todolistId2', taskId: '2', model:
            {
                title: 'beer'
            }
    })

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][1].title).toBe('JS');
    expect(endState['todolistId2'][1].title).toBe('beer');
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistTC.fulfilled({todolist: {id: 'todolistId3', title: "New", addedDate: "", order: 0}}, 'requestId', 'New')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('property with todolistId should be deleted', () => {

    const action = deleteTodolistTC.fulfilled({todolistId: 'todolistId2'}, 'requestId', 'todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test('property [todolistId]: [] should be added in the taskState', () => {

    const endState = tasksReducer({}, getTodolistsTC.fulfilled(startTodolists, 'requestId', undefined))

    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState['1']).toStrictEqual([])
})

test('tasks should be added in correct todolist', () => {

    const tasks = [
        {
            id: '1', title: 'CSS', status: TasksStatuses.New,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: 'todolistId2',
            order: 0,
            addedDate: '',
            description: '',
            entityStatus: "idle"
        },
        {
            id: '2', title: 'JS', status: TasksStatuses.New,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: 'todolistId2',
            order: 0,
            addedDate: '',
            description: '',
            entityStatus: "idle"
        },
    ]

    const endState = tasksReducer(startState, setTasksTC.fulfilled({
        todolistId: 'todolistId2',
        tasks
    }, 'requestId', 'todolistId2'))


    expect(endState['todolistId2'][0].title).toBe('CSS')
    expect(endState['todolistId2'].length).toBe(2)
})

test('the state must be set to empty {}', () => {

    const endState = tasksReducer({}, logoutTC.fulfilled(undefined, 'requestId', undefined));

    expect(endState).toStrictEqual({})
})