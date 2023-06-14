import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatchType, AppRootStateType, ThunkErrorType} from "./types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatchType
    rejectValue: ThunkErrorType
}>()