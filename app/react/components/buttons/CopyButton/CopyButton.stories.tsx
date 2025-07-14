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
    <CopyButton
      copyText={copyText}
      displayText={displayText}
      data-cy="copy-button"
    >
      {children}
    </CopyButton>
  );
}

export const Primary: Story<PropsWithChildren<Props>> = Template.bind({});
Primary.args = {
  children: '复制到剪贴板',
  copyText: '这将被复制到剪贴板',
};

export const NoCopyText: Story<PropsWithChildren<Props>> = Template.bind({});
NoCopyText.args = {
  children: '复制到剪贴板但无显示文本',
  copyText: '剪贴板覆盖内容',
  displayText: '',
};
