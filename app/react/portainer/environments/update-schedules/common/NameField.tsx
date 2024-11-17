import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { EdgeUpdateSchedule } from '../types';

import { FormValues } from './types';

export function NameField() {
  const [{ name }, { error }] = useField<FormValues['name']>('name');

  return (
    <FormControl
      label="名称"
      required
      inputId="name-input"
      errors={error}
      tooltip="描述性名称有助于在有多个更新或回滚计划时识别该计划"
    >
      <Field as={Input} name={name} id="name-input" />
    </FormControl>
  );
}

export function nameValidation(
  schedules: EdgeUpdateSchedule[],
  currentId?: EdgeUpdateSchedule['id']
) {
  return string()
    .required('字段为必填')
    .test('unique', '称必须唯一', (value) =>
      schedules.every((s) => s.id === currentId || s.name !== value)
    );
}
