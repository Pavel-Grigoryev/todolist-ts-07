import {useAppDispatch, useAppSelector} from "app/store";
import React, {useCallback, useEffect} from "react";
import {addTodolistTC, getTodolistsTC, TodoListDomainType} from "./todolist-reducer";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";

export const Todolists = ({demo = false}: TodolistsPropsType) => {

    const dispatch = useAppDispatch();

    const todolists = useAppSelector<Array<TodoListDomainType>>(state => state.todolists);

    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        } else {
            dispatch(getTodolistsTC());
        }
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return (
        <>
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
        </>
    )
}

//Types

type TodolistsPropsType = {
    demo?: boolean
}