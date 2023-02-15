import {v1} from "uuid";
import {
    addTodolistTC,
    todolistsSlice,
    deleteTodolistTC,
    FilterValuesType, getTodolistsTC,
    TodoListDomainType,
    todolistReducer, updateTodolistTC
} from "./todolist-reducer";
import {RequestStatusType} from "app/app-reducer";
import {logoutTC} from "../Auth/auth-reducer";


let todolistId1: string;
let todolistId2: string;


let startState: Array<TodoListDomainType>;

beforeEach( () => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", filter: "all",  addedDate: "", order: 0, entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistReducer(startState, deleteTodolistTC.fulfilled({todolistId: todolistId1}, 'requestId',  todolistId1))
    //
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolist = {id: 'todolistId3', title: "New", addedDate: "", order: 0, entityStatus: 'idle'}

    const endState = todolistReducer(startState, addTodolistTC.fulfilled({todolist: newTodolist}, 'requestId', 'New'))
    //
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('New');
});


test('correct filter of todolist should be changed', () => {


    let newFilter: FilterValuesType = "completed";

    const endState = todolistReducer(startState, todolistsSlice.changeTodolistFilterAC({filter: newFilter, id: todolistId2}) );

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});


test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistReducer(startState, updateTodolistTC.fulfilled({title: newTodolistTitle, id: todolistId2}, 'requestId', { id: todolistId2, title: 'New Todolist' }));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('todolists should be set', () => {

   const newState = [
        {id: todolistId1, title: "What to learn",addedDate: "", order: 0},
        {id: todolistId2, title: "What to buy", addedDate: "", order: 0}
    ]

    const endState = todolistReducer([], getTodolistsTC.fulfilled(newState, 'requestId', undefined));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('What to buy');
});

test('correct todolist should change its entityStatus', () => {

    let newEntityStatus: RequestStatusType = "loading";

    const endState = todolistReducer(startState, todolistsSlice.changeTodolistEntityStatusAC({id: todolistId2, entityStatus: newEntityStatus}));

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe("loading");
});

test('the state must be set to empty []', () => {

    const endState = todolistReducer(startState,  logoutTC.fulfilled(undefined, 'requestId', undefined ));

    expect(endState).toStrictEqual([])
})