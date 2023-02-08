import {setAppStatusAC} from '../../app/app-reducer'
import {AppThunk} from "../../app/store";
import {authAPI, AuthDataType} from "../../api/todolist-api";
import {clearTodosDataAC, RESULT_CODE} from "../Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import axios, {AxiosError} from "axios";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean}> ) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})


export const authReducer = slice.reducer

// actions

export const {setIsLoggedInAC} = slice.actions

// thunks
export const loginTC = (data: AuthDataType): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(data);
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
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
            dispatch(setIsLoggedInAC({isLoggedIn: false}));
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