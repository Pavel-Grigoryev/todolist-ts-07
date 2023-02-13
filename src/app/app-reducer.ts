import {AppThunk} from "./store";
import {authAPI} from "../api/todolist-api";
import {RESULT_CODE} from "../features/Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer;

// actions

export const {setAppStatusAC, setAppErrorAC, setAppInitializedAC} = slice.actions;

//Thunks

export const initializeAppTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    debugger
    try {
        const res = await authAPI.me();
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
            dispatch(setAppStatusAC({status: "succeeded"}));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(setAppInitializedAC({isInitialized: true}));
    }
}

export const appThunks = { setAppStatusAC, setAppErrorAC, setAppInitializedAC, initializeAppTC }


//Types
export type InitialStateType = typeof initialState;