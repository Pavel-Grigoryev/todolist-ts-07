import React, {memo, useCallback} from 'react';
import {FilterValuesType, TodolistType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button,IconButton, List, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useDispatch, useSelector} from "react-redux";
import {
    addTaskAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC
} from './store/actions';
import {selectTasks} from "./store/selectors";
import {Task} from "./Task";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
}

export const Todolist = memo((props: PropsType) => {
    console.log('Tl rendered')
    const {id, filter, title} = props.todolist;

    const dispatch = useDispatch();

    const objTasks = useSelector(selectTasks);
    let tasks = objTasks[id];

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, id));
    }, [id])

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistAC(id));
    }, [id])

    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(title, id));
    }, [id]);

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("all", id)), [id, dispatch]);
    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("active", id)), [id, dispatch]);
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC("completed", id)), [id, dispatch]);

    const filterTasks = (filter: FilterValuesType) => {
        if (filter === "active") {
            return tasks.filter(t => !t.isDone)
        }
        if (filter === "completed") {
            return tasks.filter(t => t.isDone)
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




