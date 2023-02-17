import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppRootStateType} from "utils/types";


export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;