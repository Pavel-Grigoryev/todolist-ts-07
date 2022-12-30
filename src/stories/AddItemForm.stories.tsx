import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {action} from "@storybook/addon-actions";
import {IconButton, TextField} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default {
  title: 'TODOLIST/AddItemForm',
  component: AddItemForm,
    argTypes: {
        addItem: {
            description: 'Button clicked inside form'
        }
    }

} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const AddItemFormBaseExample = Template.bind({});
AddItemFormBaseExample.args = {
 addItem: action('Button clicked')
};

export const AddItemFormDisabledExample = Template.bind({});
AddItemFormDisabledExample.args = {
    addItem: action('Button clicked'),
    entityStatus: "loading"
};

export const TemplateError: ComponentStory<typeof AddItemForm> = ()=> {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>("Title is required")

    const addItem = () => {
      if (title.trim() !== "") {
        action('Button clicked');
        setTitle("");
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
                 helperText={error && 'Title is required'}
      />

      <IconButton onClick={addItem}>
        <AddIcon/>
      </IconButton>
    </div>
}

TemplateError.args = {
  addItem: action('Button clicked')
};