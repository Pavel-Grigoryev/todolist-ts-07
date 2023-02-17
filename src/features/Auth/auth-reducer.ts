import {authAPI, AuthDataType} from "api/todolist-api";
import {RESULT_CODE} from "../Todolists/todolist-reducer";
import {handleAsyncServerNetworkError, handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app";
import {ThunkErrorType} from "app/store";

const {setAppStatusAC} = appActions;

// thunks

export const loginTC = createAsyncThunk<undefined, AuthDataType, ThunkErrorType>('auth/loginTC', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (e) {
        if (axios.isAxiosError<AxiosError<{ message: string }>>(e)) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue({errors: [e.message], fieldsErrors: undefined});
        }
    }
})

export const logoutTC = createAsyncThunk('auth/logoutTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    }
})


export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true;
        });
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false;
        });
    }
})

export const authReducer = slice.reducer

// actions

export const authSlice = slice.actions


export const asyncAuthActions = {logoutTC, loginTC}

// types

export type InitialStateType = ReturnType<typeof slice.getInitialState>;