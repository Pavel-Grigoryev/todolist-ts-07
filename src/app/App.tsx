import React from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {Menu} from "@mui/icons-material";
import {Todolists} from "../features/Todolists/Todolists";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppSelector} from "./store";
import {RequestStatusType} from "./app-reducer";
import Container from "@mui/material/Container";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

export function App({demo = false}: AppPropsType) {

    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="fixed">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
                {status === "loading" && <LinearProgress color={"secondary"} style={{
                    position: "absolute",
                    bottom: "0",
                    width: "100%"
                }}/>}
            </AppBar>
            <Container style={{paddingTop: "70px"}}>
                <Todolists demo={demo}/>
            </Container>
        </div>
    );
}

// Types

type AppPropsType = {
    demo?: boolean
}