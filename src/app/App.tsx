import React, {useEffect} from 'react';
import s from './App.module.css';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import {Menu} from "@mui/icons-material";
import {Todolists} from "features/Todolists";
import LinearProgress from "@mui/material/LinearProgress";
import {asyncAppActions} from "features/Application/application-reducer";
import Container from "@mui/material/Container";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/Auth/Login";
import CircularProgress from "@mui/material/CircularProgress";
import {asyncAuthActions} from "features/Auth/auth-reducer";
import {ErrorSnackbar} from "components/ErrorSnackbar";
import {useActions} from "hooks/useActions";
import {useAppSelector} from "hooks/useAppSelector";
import {authSelectors} from "features/Auth";
import {selectIsInitialized, selectStatus} from "../features/Application/application-selectors";
import logoImg from 'assets/images/TaskSpot_logo.png'

export function App({demo = false}: AppPropsType) {

    const status = useAppSelector(selectStatus);
    const isInitialized = useAppSelector(selectIsInitialized);
    const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

    const {initializeAppTC} = useActions(asyncAppActions);
    const {logoutTC} = useActions(asyncAuthActions);

    useEffect(() => {
        if (demo || isLoggedIn) {
            return
        } else {
            initializeAppTC();
        }

    }, [])

    const logoutHandler = () => {
        logoutTC();
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress style={{width: "80px", height: "80px"}}/>
        </div>
    }


    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="fixed">
                <Toolbar style={{justifyContent: "center", position: "relative"}}>
                   {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{marginRight: 'auto'}}>
                        <Menu/>
                    </IconButton>*/}
                    <div className={s.logoImgBlock}>
                        <img src={logoImg} alt="logo"/>
                    </div>
                    {isLoggedIn && <Button color="inherit" variant={"outlined"} onClick={logoutHandler} sx={{position: "absolute", right: "24px", top: "50%", transform: "translateY(-50%)"}}>Logout</Button>}
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
                    <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
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