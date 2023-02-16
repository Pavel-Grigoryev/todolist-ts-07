import React, {memo, useCallback} from 'react';
import {AddItemForm} from 'components/AddItemForm';
import {EditableSpan} from 'components/EditableSpan';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {Task} from "./Task/Task";
import {FilterValuesType, TodoListDomainType} from "../todolist-reducer";
import {TasksStatuses} from "api/todolist-api";
import {TasksStateType} from "../tasks-reducer";
import {useActions} from "hooks/useActions";
import {useAppSelector} from "hooks/useAppSelector";
import {tasksActions, tasksSelectors, todolistActions} from "../index";
import {useAppDispatch} from "hooks/useAppDispatch";
import {AddItemFormSubmitHelperType} from "../../../components/AddItemForm/AddItemForm";


export const Todolist = memo(({todolist}: PropsType) => {

    const {id, filter, title, entityStatus} = todolist;


    const {deleteTodolistTC, updateTodolistTC, changeTodolistFilterAC} = useActions(todolistActions)
    const dispatch = useAppDispatch()


    const objTasks = useAppSelector<TasksStateType>(tasksSelectors.selectorObjTasks);
    let tasks = objTasks[id];

    const addTask = useCallback(async (title: string, helpers: AddItemFormSubmitHelperType) => {
        const resultAction = await dispatch(tasksActions.addTaskTC({todolistId: id, title}));
        if (tasksActions.addTaskTC.rejected.match(resultAction)) {
            if (resultAction.payload?.errors?.length) {
                const errorMessage = resultAction.payload.errors[0];
                helpers.setError(errorMessage);
            } else {
                helpers.setError('Some error occurred');
            }
        } else {
            helpers.setError(null);
            helpers.setTitle('');
        }

    }, [id])

    const removeTodolist = useCallback(() => {
        deleteTodolistTC(id);
    }, [id])

    const changeTodolistTitle = useCallback((title: string) => {
        updateTodolistTC({id, title});
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

    return <div style={{textAlign: 'left', position: 'relative'}}>
        <IconButton onClick={removeTodolist} disabled={entityStatus === "loading"}
                    style={{position: 'absolute', top: '-5px', right: '0'}}>
            <DeleteOutlineOutlinedIcon/>
        </IconButton>
        <Typography variant={"h5"} style={{marginBottom: "10px", paddingRight: '40px'}}><EditableSpan value={title}
                                                                                                      onChange={changeTodolistTitle}/>
        </Typography>
        <AddItemForm addItem={addTask} entityStatus={entityStatus} sx={{width: '86%'}}/>
        <List>
            {
                filterTasks(filter).map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 todolistId={id}
                    />
                })
            }
            {!tasks.length && <div style={{margin: '0 0 10px 10px', color: 'grey'}}>No tasks</div>}
        </List>
        <div style={{textAlign: 'center'}}>
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
