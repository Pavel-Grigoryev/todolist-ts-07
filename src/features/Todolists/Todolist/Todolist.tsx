import React, {FC, memo} from 'react';
import {AddItemForm} from 'components/AddItemForm';
import {EditableSpan} from 'components/EditableSpan';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {Task} from "./Task/Task";
import {TodoListDomainType} from "../todolist-reducer";
import {useTodolist} from "./hooks/useTodolist";
import {useTasks} from "../hooks/useTasks";
import {ButtonWithMemo} from "./ButtonWithMemo";

type PropsType = {
    todolist: TodoListDomainType
}
export const Todolist: FC<PropsType> = memo(({todolist}) => {

    const {id, filter, title, entityStatus} = todolist;

    const {removeTodolist, changeTodolistTitle, onChangeFilterHandler} = useTodolist(id);

    const {
        tasks,
        addTask,
        filterTasks
    } = useTasks(id);


    return <div style={{textAlign: 'left', position: 'relative'}}>
        <IconButton onClick={removeTodolist} disabled={entityStatus === "loading"}
                    style={{position: 'absolute', top: '-5px', right: '0'}}>
            <DeleteOutlineOutlinedIcon/>
        </IconButton>
        <Typography variant={"h5"} style={{marginBottom: "10px", paddingRight: '40px'}}><EditableSpan value={title}
                                                                                                      onChange={changeTodolistTitle}/>
        </Typography>
        <AddItemForm addItem={addTask} entityStatus={entityStatus} sx={{width: '86%'}}/>
        <List>
            {
                filterTasks(filter).map(t => {
                    return <Task key={t.id}
                                 task={t}
                                 todolistId={id}
                    />
                })
            }
            {!tasks.length && <div style={{margin: '0 0 10px 10px', color: 'grey'}}>No tasks</div>}
        </List>
        <div style={{textAlign: 'center'}}>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'all' ? "primary" : "secondary"}
                            onclick={() => onChangeFilterHandler('all')} title={'All'} marginRight={'10px'}/>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'active' ? "primary" : "secondary"}
                            onclick={() => onChangeFilterHandler('active')} title={'Active'} marginRight={'10px'}/>
            <ButtonWithMemo variant={"contained"}
                            color={filter === 'completed' ? "primary" : "secondary"}
                            onclick={() => onChangeFilterHandler('completed')} title={'Completed'}/>
        </div>
    </div>
})



