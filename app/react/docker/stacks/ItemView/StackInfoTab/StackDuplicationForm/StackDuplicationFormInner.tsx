import { Field, Form, useFormikContext } from 'formik';
import { Copy, ArrowRight } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { Input } from '@@/form-components/Input';
import { FormError } from '@@/form-components/FormError';
import { TextTip } from '@@/Tip/TextTip';

import { FormSubmitValues, ActionType } from './StackDuplicationForm.types';
import { useValidation } from './StackDuplicationForm.validation';
import { EnvSelector } from './EnvSelector';

interface Props {
  yamlError?: string;
  currentEnvironmentId: EnvironmentId;
  currentStackName: string;
  isLoading: boolean;
}

export function StackDuplicationFormInner({
  yamlError,
  currentEnvironmentId,
  currentStackName,
  isLoading,
}: Props) {
  const { values, errors, setFieldValue, submitForm } =
    useFormikContext<FormSubmitValues>();

  const validState = useValidation({
    values,
    currentStackName,
    currentEnvironmentId,
  });

  const isEnvSelected = !!values.environmentId;

  async function handleAction(type: ActionType) {
    // Set the actionType in form values before submitting
    await setFieldValue('actionType', type);
    await submitForm();
  }

  const isMigrateInProgress = isLoading && values.actionType === 'migrate';
  const isDuplicateInProgress = isLoading && values.actionType === 'duplicate';

  const isMigrateDisabled = isLoading || !validState.migrate;
  const isDuplicateDisabled = isLoading || !validState.duplicate || !!yamlError;

  return (
    <Form>
      <TextTip color="blue">
        <p>此功能允许您复制或迁移此堆栈。</p>
        <p>如需重命名堆栈，请在迁移时选择同一个环境。</p>
      </TextTip>

      <div className="form-group">
        <Field
          as={Input}
          type="text"
          placeholder="堆栈名称（迁移时可选）"
          aria-label="堆栈名称"
          name="newName"
          data-cy="stack-duplicate-name-input"
        />
        {errors.newName && (
          <div className="col-sm-12">
            <FormError>{errors.newName}</FormError>
          </div>
        )}
      </div>

      <EnvSelector
        onChange={(value) => setFieldValue('environmentId', value)}
        value={values.environmentId}
        error={errors.environmentId}
      />

      <div className="inline-flex gap-2">
        <LoadingButton
          type="button"
          color="primary"
          size="small"
          disabled={isMigrateDisabled}
          isLoading={isMigrateInProgress}
          loadingText={
            values.environmentId === currentEnvironmentId
              ? '正在重命名...'
              : '正在迁移...'
          }
          onClick={() => handleAction('migrate')}
          icon={ArrowRight}
          data-cy="stack-migrate-button"
          className="!ml-0"
        >
          {values.environmentId === currentEnvironmentId ? '重命名' : '迁移'}
        </LoadingButton>

        <LoadingButton
          type="button"
          color="primary"
          size="small"
          disabled={isDuplicateDisabled}
          isLoading={isDuplicateInProgress}
          loadingText="正在复制..."
          onClick={() => handleAction('duplicate')}
          icon={Copy}
          data-cy="stack-duplicate-button"
        >
          复制
        </LoadingButton>
      </div>

      {yamlError && isEnvSelected && (
        <div className="form-group" role="alert" aria-label="YAML 错误">
          <div>
            <span className="text-danger small">{yamlError}</span>
          </div>
        </div>
      )}
    </Form>
  );
}
