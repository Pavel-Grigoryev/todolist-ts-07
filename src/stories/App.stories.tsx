import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {App} from "../app/App";
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";


export default {
  title: 'TODOLIST/App',
  component: App,
  decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App/>;

export const AppStory = Template.bind({});



