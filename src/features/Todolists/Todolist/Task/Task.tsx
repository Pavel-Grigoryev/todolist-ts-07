import React, {FC, memo} from 'react';
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {TaskDomainType} from "features/Todolists/tasks-reducer";
import {TasksStatuses} from "api/types";
import {EditableSpan} from "components/EditableSpan";
import {useTask} from "./hooks/useTask";

export type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
}

export const Task: FC<TaskPropsType> = memo(({task, todolistId}) => {

    const {onChangeTaskStatusHandler, onChangeTaskTitleHandler, removeTaskHandler} = useTask(todolistId, task.id);

    return (
        <ListItem className={task.status === TasksStatuses.Completed ? "is-done" : ""}
                  style={{
                      textDecoration: task.status === TasksStatuses.Completed ? "line-through" : "none",
                      justifyContent: 'flex-start'
                  }}
        >
            <Checkbox
                onChange={onChangeTaskStatusHandler}
                checked={task.status === TasksStatuses.Completed}
                size={"small"}
                color="secondary"
                disabled={task.entityStatus === "loading"}
            />
            <EditableSpan value={task.title}
                          onChange={onChangeTaskTitleHandler}
                          spanStyle={{flexGrow: '1'}}
            />
            <IconButton onClick={removeTaskHandler} size="small" disabled={task.entityStatus === "loading"}
            >
                <DeleteOutlineOutlinedIcon style={{width: '20px'}}/>
            </IconButton>
        </ListItem>
    );
});





