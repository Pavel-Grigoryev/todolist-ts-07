import {Dispatch} from "redux";
import {CommonResponseType} from "api/todolist-api";
import {AxiosError} from "axios";
import {appActions} from "../app";

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length !==0) {
        dispatch(appActions.setAppErrorAC({error: data.messages[0]}));
    } else {
        dispatch(appActions.setAppErrorAC({error: "Some error occurred"}));
    }
    dispatch(appActions.setAppStatusAC({status: "failed"}));
}

export const handleServerNetworkError = (err: AxiosError<{message: string}>, dispatch: Dispatch) => {
    const error = err.response?.data ? err.response.data.message : err.message;
    dispatch(appActions.setAppErrorAC({error}));
    dispatch(appActions.setAppStatusAC({status:"failed"}));
}
