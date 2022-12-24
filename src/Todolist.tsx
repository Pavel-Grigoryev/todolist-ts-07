import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from './components/AddItemForm';
import {EditableSpan} from './components/EditableSpan';
import {Button, IconButton, List, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useSelector} from "react-redux";

import {selectTasks} from "./store/selectors";
import {Task} from "./Task";
import {
    changeTodolistFilterAC,
    deleteTodolistTC,
    FilterValuesType,
    TodoListDomainType,
    updateTodolistTC
} from "./store/reducers/todolist-reducer";
import {TasksStatuses} from "./api/todolist-api";
import {addTaskAC, addTaskTC, setTasksTC} from "./store/reducers/tasks-reducer";
import {appDispatch} from "./store/store";


type PropsType = {
    todolist: TodoListDomainType
}

export const Todolist = memo((props: PropsType) => {

    const {id, filter, title} = props.todolist;

    const dispatch = appDispatch();

    useEffect(() => {
        dispatch(setTasksTC(id))
    }, [])

    const objTasks = useSelector(selectTasks);
    let tasks = objTasks[id];

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(id, title));
    }, [id])

    const removeTodolist = useCallback(() => {
        dispatch(deleteTodolistTC(id));
    }, [id])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistTC(id, title));
    }, [id]);

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("all", id)), [id, dispatch]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("active", id)), [id, dispatch]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("completed", id)), [id, dispatch]);

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
            <IconButton onClick={removeTodolist}>
                <DeleteOutlineOutlinedIcon/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask}/>
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




