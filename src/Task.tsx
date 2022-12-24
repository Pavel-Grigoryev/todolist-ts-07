import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@mui/material";
import {EditableSpan} from "./components/EditableSpan";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {deleteTaskTC, updateTaskTC} from "./store/reducers/tasks-reducer";
import {TasksStatuses, TaskType} from "./api/todolist-api";
import {appDispatch} from "./store/store";

export type TaskPropsType = {
    task: TaskType
    todolistId: string

}

export const Task = memo((props: TaskPropsType) => {

    const dispatch = appDispatch();

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
         let status = e.currentTarget.checked ? props.task.status = TasksStatuses.Completed : TasksStatuses.New;
         dispatch(updateTaskTC(props.todolistId, props.task.id, {status}));
    },[props.task.id]);

    const onChangeTaskTitleHandler = useCallback((title: string) => {
        dispatch(updateTaskTC(props.todolistId, props.task.id, {title}))
    }, [props.task.id,  props.todolistId] );

    const removeTaskHandler = () => {
                dispatch(deleteTaskTC(props.todolistId, props.task.id));
    };

    return (
        <ListItem className={props.task.status === TasksStatuses.Completed ? "is-done" : ""}
                  style={{
                      textDecoration: props.task.status === TasksStatuses.Completed ? "line-through" : "none",
                      justifyContent: 'flex-start'
                  }}
        >
            <Checkbox
                onChange={onChangeTaskStatusHandler}
                checked={props.task.status === TasksStatuses.Completed}
                size={"small"}
                color="secondary"
            />
            <EditableSpan value={props.task.title}
                          onChange={onChangeTaskTitleHandler}
            />
            <IconButton onClick={removeTaskHandler} size="small">
                <DeleteOutlineOutlinedIcon style={{width: '20px'}}/>
            </IconButton>
        </ListItem>
    );
});





