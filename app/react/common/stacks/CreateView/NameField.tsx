import { FormikErrors } from 'formik';
import { SchemaOf, string } from 'yup';
import { useMemo } from 'react';

import { STACK_NAME_VALIDATION_REGEX } from '@/react/constants';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { useStacks } from '../queries/useStacks';

export function NameField({
  onChange,
  value,
  errors,
  placeholder,
}: {
  onChange(value: string): void;
  value: string;
  errors?: FormikErrors<string>;
  placeholder?: string;
}) {
  return (
    <FormControl inputId="name-input" label="名称" errors={errors} required>
      <Input
        id="name-input"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder}
        required
        data-cy="stack-name-input"
      />
    </FormControl>
  );
}

export function useNameValidation(
  environmentId: EnvironmentId
): SchemaOf<string> {
  const stacksQuery = useStacks();

  return useMemo(
    () =>
      string()
        .required('名称为必填项')
        .test(
          'unique',
          '名称必须唯一',
          (value) =>
            stacksQuery.data?.every(
              (s) => s.EndpointId !== environmentId || s.Name !== value
            ) ?? true
        )
        .matches(
          new RegExp(STACK_NAME_VALIDATION_REGEX),
          "此字段必须由小写字母数字字符、'_' 或 '-' 组成（例如 'my-name' 或 'abc-123'）。"
        ),
    [environmentId, stacksQuery.data]
  );
}
