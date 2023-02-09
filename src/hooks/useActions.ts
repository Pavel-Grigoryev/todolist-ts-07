import {useMemo} from 'react'

import {ActionCreator, ActionCreatorsMapObject, bindActionCreators} from 'redux'
import {useAppDispatch} from "./useAppDispatch";
import {AsyncThunk} from "@reduxjs/toolkit";


/*type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true
export type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>
export type ReplaceReturnType<T, TNewReturn> = T extends (a: infer A) => infer R
    ? IsValidArg<A> extends true
        ? (a: A) => TNewReturn
        : () => TNewReturn
    : never
export type RemapActionCreators<T extends ActionCreatorsMapObject> = {
    [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
}*/

type BoundActions<Actions extends ActionCreatorsMapObject> = {
    [key in keyof Actions]: Actions[key] extends AsyncThunk<any, any, any>
        ? BoundAsyncThunk<Actions[key]>
        : Actions[key];
};

type BoundAsyncThunk<Action extends ActionCreator<any>> = (
    ...args: Parameters<Action>
) => ReturnType<ReturnType<Action>>;


export const useActions = <T extends ActionCreatorsMapObject>(actions: T): BoundActions<T> => {
    const dispatch = useAppDispatch()

    return useMemo(
        () => bindActionCreators(actions, dispatch),
        [actions, dispatch]
    )
}
