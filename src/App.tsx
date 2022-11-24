import React, {useCallback} from 'react';
import './App.css';
import {TaskType} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@mui/material';
import {Menu} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux"
import {Todolist} from "./Todolist";
import {addTodolistAC} from "./store/actions";
import {selectTodolists} from "./store/selectors";

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


export function App() {

     const dispatch = useDispatch();

     const todolists = useSelector(selectTodolists);

    const addTodolist = useCallback((title: string)  => {
        let action = addTodolistAC(title);
        dispatch(action);
    }, [dispatch])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid container style={{margin: "30px 0"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={5}>
                    {
                        todolists.map(tl => {

                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{width: "300px", padding: '20px'}}
                                           elevation={8}
                                    >
                                        <Todolist
                                            todolist={tl}
                                        />
                                    </Paper>
                                </Grid>
                            )

                        })
                    }
                </Grid>

            </Container>


        </div>
    );
}

