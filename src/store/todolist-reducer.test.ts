import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../App";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC, ChangeTodolistTitleAC, RemoveTodolistAC,
    todoListReducer
} from "./todolist-reducer";


test('correct todolist should be removed', () => {
    //
    let todolistId1 = v1();
    let todolistId2 = v1();


    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
    //
    //const endState = todoListReducer(startState, {type: 'REMOVE-TODOLIST', todolistId: todolistId1})
    const endState = todoListReducer(startState, RemoveTodolistAC(todolistId1))
    //
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    //
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
    //
    //const endState = todoListReducer(startState, {type: 'ADD-TODOLIST', title: newTodolistTitle, todolistId: v1()})
    const endState = todoListReducer(startState, AddTodolistAC(newTodolistTitle, v1()))
    //
    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newFilter: FilterValuesType = "completed";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    //const endState = todoListReducer(startState, {type: "CHANGE-TODOLIST-FILTER", filter: newFilter, todolistId: todolistId2} );
    const endState = todoListReducer(startState, ChangeTodolistFilterAC(newFilter, todolistId2) );

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});


test('correct todolist should change its name', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    const startState: Array<TodolistType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]

    //const endState = todoListReducer(startState, {type: "CHANGE-TODOLIST-TITLE", title: newTodolistTitle, todolistId: todolistId2} );
    const endState = todoListReducer(startState, ChangeTodolistTitleAC(newTodolistTitle, todolistId2));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

