import {AppThunk} from "./store";
import {authAPI} from "../api/todolist-api";
import {RESULT_CODE} from "../features/Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status};
        case "APP/SET-ERROR":
            return {...state, error: action.error};
        case "APP/SET-INITIALIZED":
            return {...state, isInitialized: action.isInitialized};
        default:
            return state;
    }
}

//Actions

export const setAppStatusAC = (status: RequestStatusType) =>({type: "APP/SET-STATUS",  status} as const);
export const setAppErrorAC = (error: null | string) =>({type: "APP/SET-ERROR",  error} as const);
export const setAppInitializedAC = (isInitialized: boolean) =>({type: "APP/SET-INITIALIZED", isInitialized} as const);

//Thunks

export const initializeAppTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    try {
        const res = await authAPI.me();
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setAppStatusAC("succeeded"));
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
        }
    } finally {
        dispatch(setAppInitializedAC(true));
    }
}



//Types

type SetAppStatusAT = ReturnType<typeof setAppStatusAC>;
type SetAppErrorAT = ReturnType<typeof setAppErrorAC>;
type SetAppInitializedAT = ReturnType<typeof setAppInitializedAC>;
export type AppActionsType = SetAppStatusAT | SetAppErrorAT | SetAppInitializedAT;
export type InitialStateType = typeof initialState;