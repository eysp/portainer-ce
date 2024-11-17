import { Meta } from '@storybook/react';
import { Download } from 'lucide-react';

import { LoadingButton } from './LoadingButton';

export default {
  component: LoadingButton,
  title: 'Components/Buttons/LoadingButton',
} as Meta;

interface Args {
  loadingText: string;
  isLoading: boolean;
}

function Template({ loadingText, isLoading }: Args) {
  return (
    <LoadingButton
      loadingText={loadingText}
      isLoading={isLoading}
      icon={Download}
    >
      下载
    </LoadingButton>
  );
}

Template.args = {
  loadingText: '加载中',
  isLoading: false,
};

export const Example = Template.bind({});

export function IsLoading() {
  return (
    <LoadingButton loadingText="加载中" isLoading icon={Download}>
      下载
    </LoadingButton>
  );
}
