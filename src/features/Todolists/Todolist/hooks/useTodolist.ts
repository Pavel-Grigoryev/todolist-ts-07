import {useActions} from "hooks/useActions";
import {todolistActions} from "../../index";
import {useCallback} from "react";
import {FilterValuesType} from "../../todolist-reducer";

export const useTodolist = (id: string) => {

    const {deleteTodolistTC, updateTodolistTC, changeTodolistFilterAC} = useActions(todolistActions);
    const removeTodolist = useCallback(() => {
        deleteTodolistTC(id);
    }, [id])

    const changeTodolistTitle = useCallback((title: string) => {
        updateTodolistTC({id, title});
    }, [id]);

    const onChangeFilterHandler = useCallback((filter: FilterValuesType) => changeTodolistFilterAC({filter, id}), [id]);

    return {removeTodolist, changeTodolistTitle, onChangeFilterHandler}
}
