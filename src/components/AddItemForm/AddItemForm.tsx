import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from '@mui/icons-material/Add';
import {RequestStatusType} from "app/app-reducer";

type AddItemFormPropsType = {
    addItem: (title: string) => Promise<any>
    entityStatus?: RequestStatusType
    sx?: StylesType
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const addItem = async () => {
        if (title.trim() !== "") {
            try {
                await props.addItem(title);
                setTitle("");
                setError(null)
            } catch (e: any) {
                setError(e.message)
            }
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField id="standard-basic"
                   value={title}
                   size={"small"}
                   label="title"
                   variant="outlined"
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
                   helperText={error}
                   disabled={props.entityStatus === "loading"}
                   sx={props.sx}
        />

        <IconButton onClick={addItem} disabled={props.entityStatus === "loading"}>
            <AddIcon/>
        </IconButton>
        {/*{error && <div className="error-message">{error}</div>}*/}
    </div>
})

//Types

type StylesType = {
    width?: string
}


