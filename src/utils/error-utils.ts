import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {Dispatch} from "redux";
import {CommonResponseType} from "api/todolist-api";
import {AxiosError} from "axios";

export const handleServerAppError = <T>(data: CommonResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length !==0) {
        dispatch(setAppErrorAC({error: data.messages[0]}));
    } else {
        dispatch(setAppErrorAC({error: "Some error occurred"}));
    }
    dispatch(setAppStatusAC({status: "failed"}));
}

export const handleServerNetworkError = (err: AxiosError<{message: string}>, dispatch: Dispatch) => {
    const error = err.response?.data ? err.response.data.message : err.message;
    dispatch(setAppErrorAC({error}));
    dispatch(setAppStatusAC({status:"failed"}));
}
