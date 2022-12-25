import {AppDispatch, useAppSelector} from "../../app/store";
import React, {useCallback, useEffect} from "react";
import {addTodolistTC, getTodolistsTC, TodoListDomainType} from "./todolist-reducer";
import {Container, Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

export const Todolists = () => {

    const dispatch = AppDispatch();

    const todolists = useAppSelector<Array<TodoListDomainType>>(state => state.todolists);

    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
    }, [dispatch])

    return (
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
    )

}