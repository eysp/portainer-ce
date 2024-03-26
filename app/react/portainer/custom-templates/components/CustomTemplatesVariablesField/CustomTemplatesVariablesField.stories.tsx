import { useState } from 'react';

import { VariableDefinition } from '../CustomTemplatesVariablesDefinitionField/CustomTemplatesVariablesDefinitionField';

import {
  CustomTemplatesVariablesField,
  Variables,
} from './CustomTemplatesVariablesField';

export default {
  title: 'Custom Templates/Variables Field',
  component: CustomTemplatesVariablesField,
};

const definitions: VariableDefinition[] = [
  {
    label: '镜像名称',
    name: 'image_name',
    defaultValue: 'nginx',
    description: '',
  },
  {
    label: '必填字段',
    name: 'required_field',
    defaultValue: '',
    description: '',
  },
  {
    label: '带有工具提示的必填字段',
    name: 'required_field',
    defaultValue: '',
    description: '工具提示',
  },
];

function Template() {
  const [value, setValue] = useState<Variables>(
    Object.fromEntries(
      definitions.map((def) => [def.name, def.defaultValue || ''])
    )
  );

  return (
    <CustomTemplatesVariablesField
      value={value}
      onChange={setValue}
      definitions={definitions}
    />
  );
}

export const Story = Template.bind({});
