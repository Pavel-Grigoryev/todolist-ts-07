import {setAppStatusAC} from '../../app/app-reducer'
import {AppThunk} from "../../app/store";
import {authAPI, AuthDataType} from "../../api/todolist-api";
import {clearTodosDataAC, RESULT_CODE} from "../Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";

const initialState = {
    isLoggedIn: false
}


export const authReducer2 = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: AuthDataType): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(data);
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    }
}

export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(false));
            dispatch(clearTodosDataAC());
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    }
}


// types

type SetIsLoggedInAT = ReturnType<typeof setIsLoggedInAC>

export type AuthActionsType = SetIsLoggedInAT

export type InitialStateType = typeof initialState;