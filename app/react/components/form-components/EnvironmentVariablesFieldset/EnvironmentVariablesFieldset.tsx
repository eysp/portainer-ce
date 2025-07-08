import { useState } from 'react';
import { array, boolean, object, SchemaOf, string } from 'yup';

import { ArrayError } from '../InputList/InputList';
import { buildUniquenessTest } from '../validate-unique';

import { AdvancedMode } from './AdvancedMode';
import { SimpleMode } from './SimpleMode';
import { Values } from './types';

export function EnvironmentVariablesFieldset({
  onChange,
  values,
  errors,
  canUndoDelete,
}: {
  values: Values;
  onChange(value: Values): void;
  errors?: ArrayError<Values>;
  canUndoDelete?: boolean;
}) {
  const [simpleMode, setSimpleMode] = useState(true);

  return (
    <>
      {simpleMode ? (
        <SimpleMode
          onAdvancedModeClick={() => setSimpleMode(false)}
          onChange={onChange}
          value={values}
          errors={errors}
          canUndoDelete={canUndoDelete}
        />
      ) : (
        <AdvancedMode
          onSimpleModeClick={() => setSimpleMode(true)}
          data-cy="env-var-advanced-mode"
          onChange={onChange}
          value={values}
        />
      )}
    </>
  );
}

export function envVarValidation(): SchemaOf<Values> {
  return array(
    object({
      name: string().required('环境变量名称为必填项'),
      value: string().default(''),
      needsDeletion: boolean().default(false),
    })
  ).test(
    'unique',
    '此环境变量已被定义',
    buildUniquenessTest(
      () => '此环境变量已被定义',
      'name'
    )
  );
}
