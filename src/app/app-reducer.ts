import {authAPI} from "../api/todolist-api";
import {RESULT_CODE} from "../features/Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios, {AxiosError} from "axios";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

//Thunks

export const initializeAppTC = createAsyncThunk('app/initializeAppTC', async (param, {dispatch}) => {
        dispatch(setAppStatusAC({status: 'loading'}));
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
        }
    }
)

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer;

// actions

export const {setAppStatusAC, setAppErrorAC} = slice.actions;

export const appThunks = {setAppStatusAC, setAppErrorAC, initializeAppTC}


//Types

export type InitialStateType = ReturnType<typeof slice.getInitialState>;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'