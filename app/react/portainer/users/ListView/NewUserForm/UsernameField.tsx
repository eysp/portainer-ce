import { Check, XIcon } from 'lucide-react';
import { useField } from 'formik';

import { AuthenticationMethod } from '@/react/portainer/settings/types';

import { FormControl } from '@@/form-components/FormControl';
import { InputGroup } from '@@/form-components/InputGroup';
import { Icon } from '@@/Icon';

import { FormValues } from './FormValues';

export function UsernameField({
  authMethod,
}: {
  authMethod: AuthenticationMethod;
}) {
  const [{ name, onBlur, onChange, value }, { error }] =
    useField<FormValues['username']>('username');

  return (
    <FormControl
      inputId="username-field"
      label="用户名"
      required
      errors={error}
      tooltip={
        authMethod === AuthenticationMethod.LDAP
          ? '用户名必须与外部 LDAP 源中定义的用户名完全匹配。'
          : null
      }
    >
      <InputGroup>
        <InputGroup.Input
          id="username-field"
          name={name}
          placeholder="例如 jdoe"
          data-cy="user-usernameInput"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="create-username"
        />
        <InputGroup.Addon>
          {error ? (
            <Icon mode="danger" icon={XIcon} />
          ) : (
            <Icon mode="success" icon={Check} />
          )}
        </InputGroup.Addon>
      </InputGroup>
    </FormControl>
  );
}
