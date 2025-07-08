import { useState } from 'react';

import { VariableDefinition } from '../CustomTemplatesVariablesDefinitionField/CustomTemplatesVariablesDefinitionField';

import {
  CustomTemplatesVariablesField,
  Values,
} from './CustomTemplatesVariablesField';

export default {
  title: '自定义模板/变量字段',
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
    label: '带提示的必填字段',
    name: 'required_field',
    defaultValue: '',
    description: '提示信息',
  },
];

function Template() {
  const [value, setValue] = useState<Values>(
    definitions.map((def) => ({ key: def.name, value: def.defaultValue || '' }))
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
