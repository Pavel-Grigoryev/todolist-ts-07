import {appActions, applicationReducer} from "./index";
import {InitialStateType} from "./application-reducer";

const { setAppStatusAC, setAppErrorAC, initializeAppTC } = appActions;
let startState: InitialStateType


beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})

test('app should be changed its status', () => {

    const endState = applicationReducer(startState, setAppStatusAC({status: "loading"}))

    expect(endState.status).toBe("loading");

});

test('app should be changed its error message', () => {

    const endState = applicationReducer(startState, setAppErrorAC({error: "Some error"}))

    expect(endState.error).toBe("Some error");
    expect(endState.status).toBe("idle");

});

test('app should be changed its Initialized status', () => {

    const endState = applicationReducer(startState, initializeAppTC.fulfilled( undefined, 'requestId', undefined))

    expect(endState.isInitialized).toBe(true);
    expect(endState.status).toBe("idle");

});

