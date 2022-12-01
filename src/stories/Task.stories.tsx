import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from "../Task";
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";

export default {
    title: 'TODOLIST/Task',
    component: Task,
    args: {
        todolistId: 'cfdfdfdfd',
        task: {id: 'dsfg', title: 'JS', isDone: true},
    },
    decorators: [ReduxStoreProviderDecorator]

} as ComponentMeta<typeof Task>;


const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});

export const TaskIsNotDoneStory = Template.bind({});

TaskIsNotDoneStory.args = {
    task: {id: 'dsfg', title: 'JS', isDone: false},
}