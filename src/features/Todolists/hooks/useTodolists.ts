import {useActions} from "hooks/useActions";
import {todolistActions, todolistSelectors} from "../index";
import {useAppDispatch} from "hooks/useAppDispatch";
import {useAppSelector} from "hooks/useAppSelector";
import {authSelectors} from "features/Auth";
import {useCallback, useEffect} from "react";
import {AddItemFormSubmitHelperType} from "components/AddItemForm/AddItemForm";

export const useTodolists = (demo: boolean) => {
    const {getTodolistsTC} = useActions(todolistActions);
    const dispatch = useAppDispatch();

    const todolists = useAppSelector(todolistSelectors.selectTodolists);
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        } else {
            getTodolistsTC();
        }
    }, [])

    const addTodolist = useCallback(async (title: string, helpers: AddItemFormSubmitHelperType) => {
        const resultAction = await dispatch(todolistActions.addTodolistTC(title));
        if (todolistActions.addTodolistTC.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload.errors[0];
                helpers.setError(errorMessage);
            } else {
                helpers.setError('Some error occurred');
            }
        } else {
            helpers.setError(null);
            helpers.setTitle('');
        }
    }, [])

    return {
        todolists,
        isLoggedIn,
        addTodolist
    }
}
