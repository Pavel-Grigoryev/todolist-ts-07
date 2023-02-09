import React, {memo, useCallback} from 'react';
import {AddItemForm} from 'components/AddItemForm';
import {EditableSpan} from 'components/EditableSpan';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {Task} from "./Task/Task";
import {FilterValuesType, TodoListDomainType, todolistThunks} from "../todolist-reducer";
import {TasksStatuses} from "api/todolist-api";
import {TasksStateType, tasksThunks} from "../tasks-reducer";
import {useActions} from "hooks/useActions";
import {useAppSelector} from "hooks/useAppSelector";


export const Todolist = memo(({todolist}: PropsType) => {

    const {id, filter, title, entityStatus} = todolist;

    const {addTaskTC} = useActions(tasksThunks)
    const {deleteTodolistTC, updateTodolistTC, changeTodolistFilterAC} = useActions(todolistThunks)

    const objTasks = useAppSelector<TasksStateType>(state => state.tasks);
    let tasks = objTasks[id];

    const addTask = useCallback((title: string) => {
        addTaskTC(id, title);
    }, [id])

    const removeTodolist = useCallback(() => {
        deleteTodolistTC(id);
    }, [id])

    const changeTodolistTitle = useCallback((title: string) => {
        updateTodolistTC(id, title);
    }, [id]);

    const onAllClickHandler = useCallback(() => changeTodolistFilterAC({filter: "all", id}), [id]);
    const onActiveClickHandler = useCallback(() => changeTodolistFilterAC({
        filter: "active",
        id
    }), [id]);
    const onCompletedClickHandler = useCallback(() => changeTodolistFilterAC({
        filter: "completed",
        id
    }), [id]);

    const filterTasks = (filter: FilterValuesType) => {
        if (filter === "active") {
            return tasks.filter(t => t.status === TasksStatuses.New)
        }
        if (filter === "completed") {
            return tasks.filter(t => t.status === TasksStatuses.Completed)
        }
        return tasks
    }

    return <div style={{textAlign: 'center'}}>
        <Typography variant={"h5"} style={{marginBottom: "10px"}}><EditableSpan value={title}
                                                                                onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={entityStatus === "loading"}>
                <DeleteOutlineOutlinedIcon/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask} entityStatus={entityStatus}/>
        <List>
            {
                filterTasks(filter).map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 todolistId={id}
                    />
                })
            }
        </List>
        <div>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'all' ? "primary" : "secondary"}
                            onclick={onAllClickHandler} title={'All'} marginRight={'10px'}/>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'active' ? "primary" : "secondary"}
                            onclick={onActiveClickHandler} title={'Active'} marginRight={'10px'}/>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'completed' ? "primary" : "secondary"}
                            onclick={onCompletedClickHandler} title={'Completed'}/>
        </div>
    </div>
})


type ButtonWithMemoPropsType = {
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
    onclick: () => void
    title: string
    marginRight?: string
}

const ButtonWithMemo = memo((props: ButtonWithMemoPropsType) => {
    return <Button
        onClick={props.onclick}
        variant={props.variant}
        color={props.color}
        size={"small"}
        style={{
            marginRight: `${props.marginRight}`
        }}
        disableElevation
    >
        {props.title}
    </Button>

})

//Types

type PropsType = {
    todolist: TodoListDomainType
}
