import React, {useCallback, useEffect} from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "components/AddItemForm";
import {Todolist} from "./Todolist";
import {Navigate} from "react-router-dom";
import {useActions} from "hooks/useActions";
import {useAppSelector} from "hooks/useAppSelector";
import {todolistActions, todolistSelectors} from "./index";
import {authSelectors} from "../Auth";

type TodolistsPropsType = {
    demo?: boolean
}

export const Todolists = ({demo = false}: TodolistsPropsType) => {

    const {getTodolistsTC, addTodolistTC} = useActions(todolistActions)

    const todolists = useAppSelector(todolistSelectors.selectTodolists);

    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        } else {
            getTodolistsTC();
        }
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodolistTC(title);
    }, [])

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


