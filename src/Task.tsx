
import React, {ChangeEvent, memo, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {TaskType} from "./Todolist";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./store/actions";

export type TaskPropsType = {
    task: TaskType
    todolistId: string

}

export const Task = memo((props: TaskPropsType) => {

    const dispatch = useDispatch();

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
         let value = e.currentTarget.checked;
         dispatch(changeTaskStatusAC(props.task.id, value, props.todolistId));
    },[props.task.id]);

    const onChangeTaskTitleHandler = useCallback((newValue: string) => {
        dispatch(changeTaskTitleAC(props.task.id, newValue, props.todolistId))
    }, [props.task.id,  props.todolistId] );

    const removeTaskHandler = () => {
                dispatch(removeTaskAC(props.task.id, props.todolistId));
    };

    return (
        <ListItem className={props.task.isDone ? "is-done" : ""}
                  style={{
                      textDecoration: props.task.isDone ? "line-through" : "none",
                      justifyContent: 'flex-start'
                  }}
        >
            <Checkbox
                onChange={onChangeTaskStatusHandler}
                checked={props.task.isDone}
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





