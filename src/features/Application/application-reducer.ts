import {authAPI} from "api/todolist-api";
import {RESULT_CODE} from "../Todolists/todolist-reducer";
import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "utils/error-utils";
import {authCommonActions} from "../CommonActions/Auth";

const {setIsLoggedInAC} = authCommonActions;

//Thunks

export const initializeAppTC = createAsyncThunk('app/initializeAppTC', async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
        try {
            const res = await authAPI.me();
            if (res.data.resultCode === RESULT_CODE.SUCCESS) {
                thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
                thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}));
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI);
            }
        } catch (error) {
            const err = error as Error | AxiosError;
            return handleAsyncServerNetworkError(err, thunkAPI);
        }
    }
)

export const slice = createSlice({
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
        }).addCase(initializeAppTC.rejected, (state) => {
            state.isInitialized = true
        })
    }
})

// actions

const {setAppStatusAC} = slice.actions

export const asyncAppActions = {initializeAppTC}

//Types

export type InitialStateType = ReturnType<typeof slice.getInitialState>;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'