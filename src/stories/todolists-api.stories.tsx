import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api";
import {ReduxStoreProviderDecorator} from "../app/ReduxStoreProviderDecorator";
import {useFormik} from "formik";


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

    }, []);

    return <div>{JSON.stringify(state)}
    </div>
}


export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)

    const formik = useFormik({
        initialValues: {
            title: '',
        },
        onSubmit: values => {
            todolistAPI.addTodolist(values.title)
                .then((res) => {
                    setState(res.data);
                })
        },
    })

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Title'}
                   {...formik.getFieldProps('title')}
            />
            <button type={'submit'}>Create Todolist</button>
        </form>
    </div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null);

    const formik = useFormik({
        initialValues: {
            todoListId: '',
        },
        onSubmit: values => {
            todolistAPI.deleteTodolist(values.todoListId)
                .then((res) => {
                    setState(res.data);
                })
        },
    });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist Id'}
                   {...formik.getFieldProps('todoListId')}
            />
            <button type={'submit'}>Delete Todolist</button>
        </form>
    </div>
};

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);

    const formik = useFormik({
        initialValues: {
            todoListId: '',
            todoListTitle: ''
        },
        onSubmit: values => {
            todolistAPI.updateTodolist(values.todoListId, values.todoListTitle)
                .then((res) => {
                    setState(res.data);
                })
        },
    });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist id'}
                   {...formik.getFieldProps('todoListId')}/>
            <input placeholder={'Title'}
                   {...formik.getFieldProps('todoListTitle')}/>
            <button type={'submit'}>Change Todolist</button>
        </form>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)

    const formik = useFormik({
        initialValues: {
            todoListId: ''
        },
        onSubmit: values => {
            todolistAPI.getTasks(values.todoListId)
                .then((res) => {
                    setState(res.data);
                })
        },
    });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist Id'}
                   {...formik.getFieldProps('todoListId')}
            />
            <button type={'submit'}>Get tasks</button>
        </form>
    </div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null);

    const formik = useFormik({
        initialValues: {
            todoListId: '',
            taskId: ''
        },
        onSubmit: values => {
            todolistAPI.deleteTask(values.todoListId, values.taskId)
                .then((res) => {
                    setState(res.data);
                })
        }
    });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist id'}
                   {...formik.getFieldProps('todoListId')}
            />
            <input placeholder={'Task id'}
                   {...formik.getFieldProps('taskId')}/>
            <button type={'submit'}>Delete Task</button>
        </form>
    </div>
}

export const AddTask = () => {
    const [state, setState] = useState<any>(null);

    const formik = useFormik({
        initialValues: {
            todoListId: '',
            title: ''
        },
        onSubmit: values => {
            todolistAPI.addTask(values.todoListId, values.title)
                .then((res) => {
                    setState(res.data);
                });
            formik.resetForm()
        }
    });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist id'}
                   {...formik.getFieldProps('todoListId')}
            />
            <input placeholder={'Task title'}
                   {...formik.getFieldProps('title')}/>
            <button type={'submit'}>Add Task</button>
        </form>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)

        const formik = useFormik({
            initialValues: {
                todoListId: '',
                taskId: '',
                title: '',
                description: '',
                status: 0,
                priority: 0,
                startDate: '',
                deadline: ''

            },
            onSubmit: values => {
                const {todoListId, taskId, ...model} = values
                todolistAPI.updateTask(todoListId, taskId, model)
                    .then((res) => {
                        setState(res.data);
                    })
            },
        });

    return <div>{JSON.stringify(state)}
        <form onSubmit={formik.handleSubmit}>
            <input placeholder={'Todolist id'} {...formik.getFieldProps('todoListId')}/>
            <input placeholder={'Task id'} {...formik.getFieldProps('taskId')}/>
            <input placeholder={'Task title'} {...formik.getFieldProps('title')}/>
            <input placeholder={'Description'} {...formik.getFieldProps('description')}/>
            <input type={'number'} placeholder={'Status'} {...formik.getFieldProps('status')}/>
            <input type={'number'} placeholder={'Priority'} {...formik.getFieldProps('priority')}/>
            <input placeholder={'StartDate'} {...formik.getFieldProps('startDate')}/>
            <input placeholder={'Deadline'} {...formik.getFieldProps('deadline')}/>
            <button type={'submit'}>Update Task</button>
        </form>
    </div>
}

