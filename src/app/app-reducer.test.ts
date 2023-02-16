import {
    appReducer,
    initializeAppTC,
    InitialStateType,
} from "./app-reducer";
import {appActions} from "./index";


let startState: InitialStateType


beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})

test('app should be changed its status', () => {

    const endState = appReducer(startState, appActions.setAppStatusAC({status: "loading"}))

    expect(endState.status).toBe("loading");

});

test('app should be changed its error message', () => {

    const endState = appReducer(startState, appActions.setAppErrorAC({error: "Some error"}))

    expect(endState.error).toBe("Some error");
    expect(endState.status).toBe("idle");

});

test('app should be changed its Initialized status', () => {

    const endState = appReducer(startState, initializeAppTC.fulfilled( undefined, 'requestId', undefined))

    expect(endState.isInitialized).toBe(true);
    expect(endState.status).toBe("idle");

});

