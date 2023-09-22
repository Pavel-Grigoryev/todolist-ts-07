import {useAppDispatch} from "hooks/useAppDispatch";
import {useAppSelector} from "hooks/useAppSelector";
import {TasksStateType} from "../tasks-reducer";
import {tasksActions, tasksSelectors} from "../index";
import {useCallback} from "react";
import {AddItemFormSubmitHelperType} from "components/AddItemForm/AddItemForm";
import {FilterValuesType} from "../todolist-reducer";
import {TasksStatuses} from "api/types";

export const useTasks = (id: string) => {
    const dispatch = useAppDispatch()

    const objTasks = useAppSelector<TasksStateType>(tasksSelectors.selectorObjTasks);
    let tasks = objTasks[id];

    const addTask = useCallback(async (title: string, helpers: AddItemFormSubmitHelperType) => {
        const resultAction = await dispatch(tasksActions.addTaskTC({todolistId: id, title}));
        if (tasksActions.addTaskTC.rejected.match(resultAction)) {
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
    }, [id])


    const filterTasks = (filter: FilterValuesType) => {
        if (filter === "active") {
            return tasks.filter(t => t.status === TasksStatuses.New)
        }
        if (filter === "completed") {
            return tasks.filter(t => t.status === TasksStatuses.Completed)
        }
        return tasks
    }

    return {
        tasks,
        addTask,
        filterTasks
    }
}
