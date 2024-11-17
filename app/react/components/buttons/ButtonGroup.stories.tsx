import { Meta, Story } from '@storybook/react';
import { PropsWithChildren } from 'react';
import { Play, RefreshCw, Square, Trash2 } from 'lucide-react';

import { Button } from './Button';
import { ButtonGroup, Props } from './ButtonGroup';

export default {
  component: ButtonGroup,
  title: 'Components/Buttons/ButtonGroup',
} as Meta;

function Template({
  size,
}: JSX.IntrinsicAttributes & PropsWithChildren<Props>) {
  return (
    <ButtonGroup size={size}>
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={Square} color="danger" onClick={() => {}}>
        停止
      </Button>
      <Button icon={RefreshCw} color="primary" onClick={() => {}}>
        重启
      </Button>
      <Button icon={Play} color="primary" disabled onClick={() => {}}>
        恢复
      </Button>
      <Button icon={Trash2} color="danger" onClick={() => {}}>
        删除
      </Button>
    </ButtonGroup>
  );
}

export const Primary: Story<PropsWithChildren<Props>> = Template.bind({});
Primary.args = {
  size: 'small',
};

export function Xsmall() {
  return (
    <ButtonGroup size="xsmall">
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={Square} color="danger" onClick={() => {}}>
        停止
      </Button>
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={RefreshCw} color="primary" onClick={() => {}}>
        重启
      </Button>
    </ButtonGroup>
  );
}

export function Small() {
  return (
    <ButtonGroup size="small">
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={Square} color="danger" onClick={() => {}}>
        停止
      </Button>
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={RefreshCw} color="primary" onClick={() => {}}>
        重启
      </Button>
    </ButtonGroup>
  );
}

export function Large() {
  return (
    <ButtonGroup size="large">
      <Button icon={Play} color="primary" onClick={() => {}}>
        启动
      </Button>
      <Button icon={Square} color="danger" onClick={() => {}}>
        停止
      </Button>
      <Button icon={Play} color="light" onClick={() => {}}>
        启动
      </Button>
      <Button icon={RefreshCw} color="primary" onClick={() => {}}>
        重启
      </Button>
    </ButtonGroup>
  );
}
