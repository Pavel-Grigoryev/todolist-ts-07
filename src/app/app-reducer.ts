
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string
}

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status};
        case "APP/SET-ERROR":
            return {...state, error: action.error};
        default:
            return state;
    }
}

//Actions

export const setAppStatusAC = (status: RequestStatusType) =>({type: "APP/SET-STATUS",  status} as const);
export const setAppErrorAC = (error: null | string) =>({type: "APP/SET-ERROR",  error} as const);


//Types

type SetAppStatusAT = ReturnType<typeof setAppStatusAC>;
type SetAppErrorAT = ReturnType<typeof setAppErrorAC>;
export type AppActionsType = SetAppStatusAT | SetAppErrorAT;
export type InitialStateType = typeof initialState;