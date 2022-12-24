import React from 'react';
import './App.css';
import {AppBar, Button, IconButton, Toolbar, Typography} from '@mui/material';
import {Menu} from "@mui/icons-material";
import {Todolists} from "../features/Todolists/Todolists";

export function App() {

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
          <Todolists/>
        </div>
    );
}

