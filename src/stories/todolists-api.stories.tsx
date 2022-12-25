import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";
import {ReduxStoreProviderDecorator} from "../app/ReduxStoreProviderDecorator";

import {Field, InjectedFormProps, reduxForm} from "redux-form";


export default {
    title: 'API',
    decorators: [ReduxStoreProviderDecorator]
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolist()
            .then((res) => {
                setState(res.data);
            })

    }, [])
    return <div>{JSON.stringify(state)}

    </div>
}


export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    const onSubmitHadler = (formData: FormDataType) => {
        todolistAPI.addTodolist(formData.todoListTitle)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <TitleReduxForm onSubmit={onSubmitHadler}/>
    </div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const onSubmitHadler = (formData: FormDataType) => {
        console.log(formData)
        todolistAPI.deleteTodolist(formData.todoListId)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <TodoListIdReduxForm onSubmit={onSubmitHadler} title={'Delete todolist'}/>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const onSubmitHadler = (formData: FormDataType) => {
        console.log(formData)
        todolistAPI.updateTodolist(formData.todoListId, formData.todoListTitle)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <TodoListIdTitleReduxForm onSubmit={onSubmitHadler}/>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const onSubmitHadler = (formData: FormDataType) => {
        todolistAPI.getTasks(formData.todoListId)
            .then((res) => {
                setState(res.data);
            })
    }
    return <div>{JSON.stringify(state)}
        <TodoListIdReduxForm onSubmit={onSubmitHadler} title={'Get tasks'} />
    </div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    const onSubmitHandler = (formData: FormDataType) => {
        todolistAPI.deleteTask(formData.todoListId, formData.taskId)
            .then((res) => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <TodoListIdTaskIdReduxForm onSubmit={onSubmitHandler}/>
    </div>
}

export const AddTask = () => {
    const [state, setState] = useState<any>(null)
    const onSubmitHandler = (formData:FormDataType) => {
        todolistAPI.addTask(formData.todoListId, formData.title)
            .then((res) => {
                setState(res.data);
            })
    }
    return <div>{JSON.stringify(state)}
        <TodoListIdTitleTaskReduxForm onSubmit={onSubmitHandler}/>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
   const onSubmitHandler = (formData: FormDataType) => {
        const {todoListTitle, todoListId, taskId, ...model} = formData
        todolistAPI.updateTask(formData.todoListId, formData.taskId, model)
            .then((res) => {
                setState(res.data);
            })
    }
    return <div>{JSON.stringify(state)}
        <TodoListIdTaskIdTaskTitleReduxForm onSubmit={onSubmitHandler}/>
    </div>
}



type FormDataType = {
    todoListTitle: string
    todoListId: string
    taskId: string
    title: string
    description: string
    status: number
    priority: number
    startDate: string
    deadline: string
}

const TitleForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field placeholder={'Title'} name={'todoListTitle'} component={'input'}/>
            <button type={'submit'}>Add Todolist</button>
        </form>
    )
}

const TitleReduxForm = reduxForm<FormDataType>({form: "TodoList"})(TitleForm);

type TodoListIdFormPropsType = {
    title: string
}

const TodoListIdForm: React.FC<InjectedFormProps<FormDataType, TodoListIdFormPropsType> & TodoListIdFormPropsType> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field placeholder={'Todolist id'} name={'todoListId'} component={'input'}/>
            <button type={'submit'}>{props.title}</button>
        </form>
    )
}

const TodoListIdReduxForm = reduxForm<FormDataType, TodoListIdFormPropsType>({form: "TodoList"})(TodoListIdForm);

const TodoListIdTitleForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field placeholder={'Todolist id'} name={'todoListId'} component={'input'}/>
            <Field placeholder={'Title'} name={'todoListTitle'} component={'input'}/>
            <button type={'submit'}>Change Todolist</button>
        </form>
    )
}

const TodoListIdTitleReduxForm = reduxForm<FormDataType>({form: "TodoList"})(TodoListIdTitleForm);

const TodoListIdTitleTaskForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field placeholder={'Todolist id'} name={'todoListId'} component={'input'}/>
            <Field placeholder={'Task title'} name={'taskTitle'} component={'input'}/>
            <button type={'submit'}>Add Task</button>
        </form>
    )
}

const TodoListIdTitleTaskReduxForm = reduxForm<FormDataType>({form: "TodoList"})(TodoListIdTitleTaskForm);


const TodoListIdTaskIdForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    return (

            <form onSubmit={props.handleSubmit}>
                <Field placeholder={'Todolist id'} name={'todoListId'} component={'input'}/>
                <Field placeholder={'Task id'} name={'taskId'} component={'input'}/>
                <button type={'submit'}>Delete Task</button>
            </form>

    )
}

const TodoListIdTaskIdReduxForm = reduxForm<FormDataType>({form: "TodoList"})(TodoListIdTaskIdForm);

const TodoListIdTaskIdTaskTitleForm: React.FC<InjectedFormProps<FormDataType>> = (props) => {
    return (

        <form onSubmit={props.handleSubmit}>
            <Field placeholder={'Todolist id'} name={'todoListId'} component={'input'}/>
            <Field placeholder={'Task id'} name={'taskId'} component={'input'}/>
            <Field placeholder={'Task title'} name={'title'} component={'input'}/>
            <Field placeholder={'Description'} name={'description'} component={'input'}/>
            <Field placeholder={'Status'} name={'status'} component={'input'}/>
            <Field placeholder={'Priority'} name={'priority'} component={'input'}/>
            <Field placeholder={'StartDate'} name={'startDate'} component={'input'}/>
            <Field placeholder={'Deadline'} name={'deadline'} component={'input'}/>
            <button type={'submit'}>Update Task</button>
        </form>

    )
}

const TodoListIdTaskIdTaskTitleReduxForm = reduxForm<FormDataType>({form: "TodoList"})(TodoListIdTaskIdTaskTitleForm);
