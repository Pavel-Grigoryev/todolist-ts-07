import React, {ChangeEvent, memo, useState} from 'react';
import TextField from "@mui/material/TextField";

type EditableSpanPropsType = {
    value: string
    onChange: (newValue: string) => void
    spanStyle?: StylesType
}

export const EditableSpan = memo((props: EditableSpanPropsType) => {
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(props.value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(props.value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        props.onChange(title);
    }
    const onChangeSetLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField id="standard-basic"
                     label="Text"
                     variant="standard"
                     value={title}
                     autoFocus onBlur={activateViewMode} onChange={onChangeSetLocalTitle}
        />
        : <span onDoubleClick={activateEditMode} style={props.spanStyle}>{props.value}</span>
});

//Types

type StylesType = {
    flexGrow?: string
}
