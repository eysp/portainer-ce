import { Meta, Story } from '@storybook/react';
import { Clock, Icon } from 'lucide-react';

import { SidebarItem } from '.';

const meta: Meta = {
  title: '侧边栏/侧边栏项',
  component: SidebarItem,
};
export default meta;

interface StoryProps {
  icon?: Icon;
  label: string;
}

function Template({ icon, label }: StoryProps) {
  return (
    <ul className="sidebar">
      <SidebarItem
        to="example.path"
        params={{ endpointId: 1 }}
        icon={icon}
        label={label}
      />
    </ul>
  );
}

export const Primary: Story<StoryProps> = Template.bind({});
Primary.args = {
  icon: Clock,
  label: '带图标的项',
};

export const WithoutIcon: Story<StoryProps> = Template.bind({});
WithoutIcon.args = {
  label: '没有图标的项',
};
