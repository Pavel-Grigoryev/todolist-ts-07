import React, {ChangeEvent, memo, useCallback} from 'react';
import  ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {deleteTaskTC, TaskDomainType, updateTaskTC} from "../../tasks-reducer";
import {TasksStatuses} from "../../../../api/todolist-api";
import {useAppDispatch} from "../../../../app/store";

export const Task = memo((props: TaskPropsType) => {

    const dispatch = useAppDispatch();

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
                disabled={props.task.entityStatus === "loading"}
            />
            <EditableSpan value={props.task.title}
                          onChange={onChangeTaskTitleHandler}
            />
            <IconButton onClick={removeTaskHandler} size="small" disabled={props.task.entityStatus === "loading"}>
                <DeleteOutlineOutlinedIcon style={{width: '20px'}}/>
            </IconButton>
        </ListItem>
    );
});

//Types

export type TaskPropsType = {
    task: TaskDomainType
    todolistId: string

}




