import {InitialStateType} from "./auth-reducer";
import {authCommonActions} from "../CommonActions/Auth";
import {authReducer} from "./index";

let startState: InitialStateType;

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})

test('isLoggedIn should be changed its status', () => {

    const endState = authReducer(startState, authCommonActions.setIsLoggedInAC({isLoggedIn: true}))

    expect(endState.isLoggedIn).toBe(true);

});



