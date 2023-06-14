import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";
import {rootReducer} from 'app/store'
import {FieldErrorType} from "api/types";


export type RootReducerType = typeof rootReducer

export type AppRootStateType = ReturnType<RootReducerType>

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export type ThunkErrorType = {
    errors: Array<string>
    fieldsErrors?: Array<FieldErrorType>
}