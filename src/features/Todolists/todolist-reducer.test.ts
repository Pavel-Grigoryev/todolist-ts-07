import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC,
    FilterValuesType,
    deleteTodolistAC, setTodolistAC,
    TodoListDomainType,
    todoListReducer, changeTodolistEntityStatusAC, clearTodosDataAC
} from "./todolist-reducer";
import {RequestStatusType} from "app/app-reducer";


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

    const endState = todoListReducer(startState, deleteTodolistAC({todolistId: todolistId1}))
    //
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolist = {id: 'todolistId3', title: "New", addedDate: "", order: 0, entityStatus: 'idle'}

    const endState = todoListReducer(startState, addTodolistAC({todolist: newTodolist}))
    //
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe('New');
});


test('correct filter of todolist should be changed', () => {


    let newFilter: FilterValuesType = "completed";

    const endState = todoListReducer(startState, changeTodolistFilterAC({filter: newFilter, id: todolistId2}) );

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});


test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todoListReducer(startState, changeTodolistTitleAC({title: newTodolistTitle, id: todolistId2}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('todolists should be set', () => {

    const endState = todoListReducer([], setTodolistAC({todolists: startState}));

    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe('What to buy');
});

test('correct todolist should change its entityStatus', () => {

    let newEntityStatus: RequestStatusType = "loading";

    const endState = todoListReducer(startState, changeTodolistEntityStatusAC({id: todolistId2, entityStatus: newEntityStatus}));

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe("loading");
});

test('the state must be set to empty []', () => {

    const endState = todoListReducer(startState, clearTodosDataAC());

    expect(endState).toStrictEqual([])
})