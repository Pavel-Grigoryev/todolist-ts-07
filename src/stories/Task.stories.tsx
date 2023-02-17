 import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from "../features/Todolists/Todolist/Task/Task";
import {ReduxStoreProviderDecorator} from "../app/ReduxStoreProviderDecorator";
import {TaskPriorities, TasksStatuses} from "../api/types";

export default {
    title: 'TODOLIST/Task',
    component: Task,
    args: {
        todolistId: 'cfdfdfdfd',
        task: {id: 'dsfg', title: 'JS', status: TasksStatuses.Completed,
            priority: TaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: 'todolistId1',
            order: 0,
            addedDate: '',
            description: '',
            entityStatus: "idle"
        },
    },
    decorators: [ReduxStoreProviderDecorator]

} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});

export const TaskIsNotDoneStory = Template.bind({});

TaskIsNotDoneStory.args = {
    task: {id: 'dsfg', title: 'JS', status: TasksStatuses.New,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        description: '',
        entityStatus: "idle"
    },
}

export const TaskDisabledStory = Template.bind({});

TaskDisabledStory.args = {
    task: {id: 'dsdfg', title: 'React', status: TasksStatuses.Completed,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        todoListId: 'todolistId1',
        order: 0,
        addedDate: '',
        description: '',
        entityStatus: "loading"
    },
}