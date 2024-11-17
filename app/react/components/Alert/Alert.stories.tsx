import { Meta, Story } from '@storybook/react';

import { Alert } from './Alert';

export default {
  component: Alert,
  title: 'Components/Alert',
} as Meta;

interface Args {
  color: 'success' | 'error' | 'info';
  title: string;
  text: string;
}

function Template({ text, color, title }: Args) {
  return (
    <Alert color={color} title={title}>
      {text}
    </Alert>
  );
}

export const Success: Story<Args> = Template.bind({});
Success.args = {
  color: 'success',
  title: '成功',
  text: '这是一个成功的提醒。非常长的文本，非常长的文本，非常长的文本，非常长的文本，非常长的文本，非常长的文本',
};

export const Error: Story<Args> = Template.bind({});
Error.args = {
  color: 'error',
  title: '错误',
  text: '这是一个错误的提醒',
};

export const Info: Story<Args> = Template.bind({});
Info.args = {
  color: 'info',
  title: '信息',
  text: '这是一个信息提醒',
};
