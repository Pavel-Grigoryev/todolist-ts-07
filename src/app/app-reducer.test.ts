import {appReducer, InitialStateType, setAppErrorAC, setAppInitializedAC, setAppStatusAC} from "./app-reducer";


let startState: InitialStateType


beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})

test('app should be changed its status', () => {

    const endState = appReducer(startState, setAppStatusAC("loading"))

    expect(endState.status).toBe("loading");

});

test('app should be changed its error message', () => {

    const endState = appReducer(startState, setAppErrorAC("Some error"))

    expect(endState.error).toBe("Some error");
    expect(endState.status).toBe("idle");

});

test('app should be changed its Initialized status', () => {

    const endState = appReducer(startState, setAppInitializedAC(true))

    expect(endState.isInitialized).toBe(true);
    expect(endState.status).toBe("idle");

});

