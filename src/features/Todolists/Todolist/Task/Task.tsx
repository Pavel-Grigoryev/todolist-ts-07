import React, {ChangeEvent, memo, useCallback} from 'react';
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {TaskDomainType, asyncTasksActions} from "features/Todolists/tasks-reducer";
import {TasksStatuses} from "api/todolist-api";
import {EditableSpan} from "components/EditableSpan";
import {useActions} from "hooks/useActions";

export const Task = memo((props: TaskPropsType) => {

    const {deleteTaskTC, updateTaskTC} = useActions(asyncTasksActions)

    const onChangeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
         let status = e.currentTarget.checked ? TasksStatuses.Completed : TasksStatuses.New;
         updateTaskTC({todolistId: props.todolistId, taskId: props.task.id,
        model: {status}
    });
    },[props.task.id]);

    const onChangeTaskTitleHandler = useCallback((title: string) => {
        updateTaskTC({todolistId: props.todolistId, taskId: props.task.id,
        model: { title }
    })
    }, [props.task.id,  props.todolistId] );

    const removeTaskHandler = () => {
                deleteTaskTC({todolistId: props.todolistId, taskId: props.task.id});
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




