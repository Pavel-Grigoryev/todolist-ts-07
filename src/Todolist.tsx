import React, {ChangeEvent} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import {Button, Checkbox, IconButton, List, ListItem, Typography} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export function Todolist(props: PropsType) {
    const addTask = (title: string) => {
        props.addTask(title, props.id);
    }

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle(props.id, title);
    }

    const onAllClickHandler = () => props.changeFilter("all", props.id);
    const onActiveClickHandler = () => props.changeFilter("active", props.id);
    const onCompletedClickHandler = () => props.changeFilter("completed", props.id);

    return <div style={{textAlign: 'center'}}>
        <Typography variant={"h5"} style={{marginBottom: "10px"}}><EditableSpan value={props.title}
                                                                                onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <DeleteOutlineOutlinedIcon/>
            </IconButton>
        </Typography>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id)
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        props.changeTaskStatus(t.id, newIsDoneValue, props.id);
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        props.changeTaskTitle(t.id, newValue, props.id);
                    }


                    return <ListItem key={t.id}
                                     className={t.isDone ? "is-done" : ""}
                                     style={{
                                         textDecoration: t.isDone ? "line-through": "none",
                                         justifyContent: 'flex-start'
                                     }}
                    >
                        <Checkbox
                            onChange={onChangeHandler}
                            checked={t.isDone}
                            size={"small"}
                            color="secondary"
                        />
                        <EditableSpan value={t.title}
                                      onChange={onTitleChangeHandler}
                        />
                        <IconButton onClick={onClickHandler} size="small">
                            <DeleteOutlineOutlinedIcon style={{width: '20px'}}/>
                        </IconButton>
                    </ListItem>
                })
            }
        </List>
        <div>
            <Button
                onClick={onAllClickHandler}
                color={props.filter === 'all' ? "primary" : "secondary"}
                variant={"contained"}
                size={"small"}
                style={{
                    marginRight: '10px'
                }}
                disableElevation
            >
                All
            </Button>
            <Button
                onClick={onActiveClickHandler}
                variant={"contained"}
                color={props.filter === 'active' ? "primary" : "secondary"}
                size={"small"}
                style={{
                    marginRight: '10px'

                }}
                disableElevation
            >
                Active
            </Button>
            <Button
                onClick={onCompletedClickHandler}
                variant={"contained"}
                color={props.filter === 'completed' ? "primary" : "secondary"}
                size={"small"}
                disableElevation
            >Completed
            </Button>
        </div>
    </div>
}


