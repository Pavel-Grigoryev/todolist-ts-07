import {authReducer, InitialStateType} from "./auth-reducer";
import {authActions} from "./index";



let startState: InitialStateType;


beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})

test('isLoggedIn should be changed its status', () => {

    const endState = authReducer(startState, authActions.setIsLoggedInAC({isLoggedIn: true}))

    expect(endState.isLoggedIn).toBe(true);

});



