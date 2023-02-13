import {setAppStatusAC} from 'app/app-reducer'
import {authAPI, AuthDataType, FieldErrorType} from "api/todolist-api";
import {RESULT_CODE} from "../Todolists/todolist-reducer";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import axios, {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


// thunks

export const loginTC = createAsyncThunk<undefined, AuthDataType, { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }>('auth/loginTC', async (param, {
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

export const logoutTC = createAsyncThunk('auth/logoutTC', async (param, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.logout()
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


const slice = createSlice({
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

export const {setIsLoggedInAC} = slice.actions


export const authThunks = {logoutTC, loginTC, setIsLoggedInAC}

// types

export type InitialStateType = ReturnType<typeof slice.getInitialState>;