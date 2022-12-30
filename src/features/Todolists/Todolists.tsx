import {AppDispatch, useAppSelector} from "../../app/store";
import React, {useCallback, useEffect} from "react";
import {addTodolistTC, getTodolistsTC, TodoListDomainType} from "./todolist-reducer";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

export const Todolists = ({demo = false}: TodolistsPropsType) => {

    const dispatch = AppDispatch();

    const todolists = useAppSelector<Array<TodoListDomainType>>(state => state.todolists);

    useEffect(() => {
        if (demo) {
            return
        } else {
            dispatch(getTodolistsTC());
        }
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch])

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
                                        demo={demo}
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