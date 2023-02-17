import {authAPI} from "api/todolist-api";
import {RESULT_CODE} from "../Todolists/todolist-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {appActions} from "features/Application";
import {ThunkErrorType} from "utils/types";
import {AuthDataType} from "api/types";
import {authCommonActions} from "../CommonActions/Auth";

const {setAppStatusAC} = appActions;

// thunks

export const loginTC = createAsyncThunk<undefined, AuthDataType, ThunkErrorType>('auth/loginTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI);
        }
    } catch (error) {
        const err = error as Error | AxiosError;
        return handleAsyncServerNetworkError(err, thunkAPI);
    }
});

export const logoutTC = createAsyncThunk('auth/logoutTC', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODE.SUCCESS) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        } else {
            return handleAsyncServerAppError(res.data, thunkAPI);
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
    reducers: {},
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true;
        })
            .addCase(logoutTC.fulfilled, (state) => {
                state.isLoggedIn = false;
            })
            .addCase(authCommonActions.setIsLoggedInAC, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })

    }
})

export const asyncAuthActions = {logoutTC, loginTC}

// types

export type InitialStateType = ReturnType<typeof slice.getInitialState>;