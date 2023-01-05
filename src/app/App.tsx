import React, {useEffect} from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {Menu} from "@mui/icons-material";
import {Todolists} from "../features/Todolists/Todolists";
import LinearProgress from "@mui/material/LinearProgress";
import {useAppDispatch, useAppSelector} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import Container from "@mui/material/Container";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import CircularProgress from "@mui/material/CircularProgress";
import {logoutTC} from "../features/Login/auth-reducer";

export function App({demo = false}: AppPropsType) {

    const status = useAppSelector<RequestStatusType>(state => state.app.status);

    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized);

    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(initializeAppTC());
    }, [])

    const logoutHandler = () => {
        dispatch(logoutTC());
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress style={{width: "80px", height: "80px"}} />
        </div>
    }


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
                    {isLoggedIn && <Button color="inherit" variant={"outlined"} onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress color={"secondary"} style={{
                    position: "absolute",
                    bottom: "0",
                    width: "100%"
                }}/>}
            </AppBar>
            <Container style={{paddingTop: "70px"}}>
                <Routes>
                    <Route path={"/"} element={<Todolists demo={demo}/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path="*" element={<Navigate to={"/404"}/>}/>
                </Routes>
            </Container>
        </div>
    );
}

// Types

type AppPropsType = {
    demo?: boolean
}