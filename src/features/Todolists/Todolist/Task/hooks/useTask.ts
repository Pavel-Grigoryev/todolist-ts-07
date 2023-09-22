import {useActions} from "hooks/useActions";
import {ChangeEvent, useCallback} from "react";
import {TasksStatuses} from "api/types";
import {tasksActions} from "../../../index";

export const useTask = (todolistId: string, taskId: string) => {

    const {deleteTaskTC, updateTaskTC} = useActions(tasksActions)

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New;
        updateTaskTC({
            todolistId, taskId,
            model: {status}
        });
    }, [taskId]);

    const onChangeTaskTitleHandler = useCallback((title: string) => {
        updateTaskTC({
            todolistId, taskId,
            model: {title}
        })
    }, [taskId, todolistId]);

    const removeTaskHandler = () => {
        deleteTaskTC({todolistId, taskId});
    };
    return {onChangeTaskStatusHandler, onChangeTaskTitleHandler, removeTaskHandler}
}
