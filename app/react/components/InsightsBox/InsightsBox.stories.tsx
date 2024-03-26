import { Meta, Story } from '@storybook/react';

import { InsightsBox, Props } from './InsightsBox';

export default {
  component: InsightsBox,
  header: 'Components/InsightsBox',
} as Meta;

function Template({ header, content }: Props) {
  return <InsightsBox header={header} content={content} />;
}

export const Primary: Story<Props> = Template.bind({});
Primary.args = {
  header: '见解框标题',
  content: '这是见解框的内容',
};
