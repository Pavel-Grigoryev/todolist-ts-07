import {authReducer, InitialStateType, setIsLoggedInAC} from "./auth-reducer";



let startState: InitialStateType;


beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})

test('isLoggedIn should be changed its status', () => {

    const endState = authReducer(startState, setIsLoggedInAC(true))

    expect(endState.isLoggedIn).toBe(true);

});



