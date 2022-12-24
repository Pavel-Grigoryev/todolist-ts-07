import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {action} from "@storybook/addon-actions";
import {EditableSpan} from "../components/EditableSpan";

export default {
  title: 'TODOLIST/EditableSpan',
  component: EditableSpan,
    argTypes: {
        onChange: {
            description: 'Title sent in the state'
        }
    }

} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanExample = Template.bind({});

EditableSpanExample.args = {
    onChange: action('EditableSpan value changed'),
    value: 'React'
};

