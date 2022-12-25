import React, {memo, useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan';
import {Button, IconButton, List, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {Task} from "./Task/Task";
import {
    changeTodolistFilterAC,
    deleteTodolistTC,
    FilterValuesType,
    TodoListDomainType,
    updateTodolistTC
} from "../todolist-reducer";
import {TasksStatuses} from "../../../api/todolist-api";
import {addTaskTC, setTasksTC, TasksStateType} from "../tasks-reducer";
import {AppDispatch, useAppSelector} from "../../../app/store";


type PropsType = {
    todolist: TodoListDomainType
}

export const Todolist = memo((props: PropsType) => {

    const {id, filter, title} = props.todolist;

    const dispatch = AppDispatch();

    const objTasks = useAppSelector<TasksStateType>(state => state.tasks);
    let tasks = objTasks[id];

    useEffect(() => {
        dispatch(setTasksTC(id))
    }, [])

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




