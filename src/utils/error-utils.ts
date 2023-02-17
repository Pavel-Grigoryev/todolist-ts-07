import {Dispatch} from "redux";
import {CommonResponseType} from "api/todolist-api";
import axios, {AxiosError} from "axios";
import {appActions} from "app";

const {setAppErrorAC, setAppStatusAC} = appActions;

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch, showError = true) => {

    if (showError) {
        dispatch(setAppErrorAC({error: data.messages.length !== 0 ? data.messages[0] : "Some error occurred"}));
    }

    dispatch(setAppStatusAC({status: "failed"}));
}

export const handleAsyncServerAppError = <T>(data: CommonResponseType<T>, thunkAPI: ThunkAPIType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppErrorAC({error: data.messages.length !== 0 ? data.messages[0] : "Some error occurred"}));
    }

    thunkAPI.dispatch(setAppStatusAC({status: "failed"}));

    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors});
}

export const handleServerNetworkError = (err: AxiosError<{ message: string }>, dispatch: Dispatch, showError = true) => {
    if (showError) {
        const error = err.response?.data ? err.response.data.message : err.message;
        dispatch(setAppErrorAC({error}));
    }
    dispatch(setAppStatusAC({status: "failed"}));
}

export const handleAsyncServerNetworkError = (err: Error | AxiosError, thunkAPI: ThunkAPIType, showError = true) => {
    if (axios.isAxiosError<AxiosError<{ message: string }>>(err)) {
        if (showError) {
            const error = err.response?.data ? err.response.data.message : err.message;
            thunkAPI.dispatch(setAppErrorAC({error}));
        }
        thunkAPI.dispatch(setAppStatusAC({status: "failed"}));
    }
    return thunkAPI.rejectWithValue({errors: [err.message], fieldsErrors: undefined});
}

//Types
// original type:
// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>
type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}
