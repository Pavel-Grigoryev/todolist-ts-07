import {AppActionsType, setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {CommonResponseType} from "../api/todolist-api";
import {AxiosError} from "axios";

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch<AppActionsType>) => {
    if (data.messages.length !==0) {
        dispatch(setAppErrorAC(data.messages[0]));
    } else {
        dispatch(setAppErrorAC("Some error occurred"));
    }
    dispatch(setAppStatusAC("failed"));
}

export const handleServerNetworkError = (err: AxiosError<{message: string}>, dispatch: Dispatch<AppActionsType>) => {
    const error = err.response?.data ? err.response.data.message : err.message;
    dispatch(setAppErrorAC(error));
    dispatch(setAppStatusAC("failed"));
}
