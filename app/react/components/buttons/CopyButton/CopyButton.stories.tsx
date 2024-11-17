import { Meta, Story } from '@storybook/react';
import { PropsWithChildren } from 'react';

import { CopyButton, Props } from './CopyButton';

export default {
  component: CopyButton,
  title: 'Components/Buttons/CopyButton',
} as Meta;

function Template({
  copyText,
  displayText,
  children,
}: JSX.IntrinsicAttributes & PropsWithChildren<Props>) {
  return (
    <CopyButton copyText={copyText} displayText={displayText}>
      {children}
    </CopyButton>
  );
}

export const Primary: Story<PropsWithChildren<Props>> = Template.bind({});
Primary.args = {
  children: '复制到剪贴板',
  copyText: '此内容将被复制到剪贴板',
};

export const NoCopyText: Story<PropsWithChildren<Props>> = Template.bind({});
NoCopyText.args = {
  children: '复制到剪贴板，没有复制的文本',
  copyText: '剪贴板覆',
  displayText: '',
};
