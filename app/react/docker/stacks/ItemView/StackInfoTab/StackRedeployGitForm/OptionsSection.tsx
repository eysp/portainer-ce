import { useFormikContext } from 'formik';

import { Stack, StackType } from '@/react/common/stacks/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { FormSection } from '@@/form-components/FormSection';

import { FormValues } from './types';

interface Props {
  stack: Stack;
  apiVersion: number;
}

export function OptionsSection({ stack, apiVersion }: Props) {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  if (stack.Type !== StackType.DockerSwarm || apiVersion < 1.27) {
    return null;
  }

  return (
    <FormSection title="选项">
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="prune"
            checked={values.prune}
            tooltip="Prune services that are no longer referenced."
            labelClass="col-sm-3 col-lg-2"
            label="Prune services"
            onChange={(value) => setFieldValue('prune', value)}
            data-cy="stack-prune-services-switch"
          />
        </div>
      </div>
    </FormSection>
  );
}
