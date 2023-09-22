import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "components/AddItemForm";
import {Todolist} from "./Todolist";
import {Navigate} from "react-router-dom";
import {useTodolists} from "./hooks/useTodolists";

type TodolistsPropsType = {
    demo?: boolean
}

export const Todolists = ({demo = false}: TodolistsPropsType) => {

    const {todolists, isLoggedIn, addTodolist} = useTodolists(demo)

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return (
        <>
            <Grid container style={{margin: "30px 0"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={5} style={{flexWrap: 'nowrap', overflowX: 'scroll', marginLeft: '-20px'}}>
                {
                    todolists.map(tl => {

                        return (
                            <Grid item key={tl.id} style={{padding: '60px 20px 40px'}}>
                                <Paper style={{width: "300px", padding: '20px', wordBreak: 'break-word'}}
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


