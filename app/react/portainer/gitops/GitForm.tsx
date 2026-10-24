import { useState } from 'react';
import { array, number, object, SchemaOf, string } from 'yup';
import { FormikErrors } from 'formik';

import { ComposePathField } from '@/react/portainer/gitops/ComposePathField';
import { RefField } from '@/react/portainer/gitops/RefField';
import { DeployMethod, GitFormModel } from '@/react/portainer/gitops/types';
import { TimeWindowDisplay } from '@/react/portainer/gitops/TimeWindowDisplay';
import { GitSourceSelector } from '@/react/portainer/gitops/sources/GitSourceSelector';

import { FormSection } from '@@/form-components/FormSection';
import { validateForm } from '@@/form-components/validate-form';

import { AdditionalFileField } from './AdditionalFilesField';
import { AutoUpdateFieldset } from './AutoUpdateFieldset';
import { autoUpdateValidation } from './AutoUpdateFieldset/validation';
import { refFieldValidation } from './RefField/RefField';

interface Props {
  value: GitFormModel;
  onChange: (value: Partial<GitFormModel>) => void;
  environmentType?: 'DOCKER' | 'KUBERNETES' | undefined;
  deployMethod?: DeployMethod;
  isDockerStandalone?: boolean;
  isAdditionalFilesFieldVisible?: boolean;
  isForcePullVisible?: boolean;
  errors?: FormikErrors<GitFormModel>;
  baseWebhookUrl?: string;
  webhookId?: string;
  webhooksDocs?: string;
  isAutoUpdateVisible?: boolean;
}

export function GitForm({
  value: initialValue,
  onChange,
  environmentType = 'DOCKER',
  deployMethod = 'compose',
  isDockerStandalone = false,
  isAdditionalFilesFieldVisible,
  isForcePullVisible,
  errors = {},
  baseWebhookUrl,
  webhookId,
  webhooksDocs,
  isAutoUpdateVisible = true,
}: Props) {
  const [value, setValue] = useState(initialValue); // TODO: remove this state when form is not inside angularjs

  return (
    <FormSection title="Git 仓库">
      <GitSourceSelector
        value={value.SourceId}
        onChange={(source) =>
          handleChange({
            SourceId: source?.id,
            RepositoryReferenceName: initialValue.RepositoryReferenceName,
            ComposeFilePathInRepository:
              initialValue.ComposeFilePathInRepository,
          })
        }
        error={errors.SourceId}
      />

      <RefField
        value={value.RepositoryReferenceName || ''}
        onChange={(value) => handleChange({ RepositoryReferenceName: value })}
        sourceId={value.SourceId}
        error={errors.RepositoryReferenceName}
      />

      <ComposePathField
        value={value.ComposeFilePathInRepository || ''}
        onChange={(value) =>
          handleChange({ ComposeFilePathInRepository: value || undefined })
        }
        isCompose={deployMethod === 'compose'}
        model={value}
        isDockerStandalone={isDockerStandalone}
        errors={errors.ComposeFilePathInRepository}
      />

      {isAdditionalFilesFieldVisible && (
        <AdditionalFileField
          value={value.AdditionalFiles || []}
          onChange={(value) => handleChange({ AdditionalFiles: value })}
          errors={errors.AdditionalFiles}
        />
      )}

      {isAutoUpdateVisible && value.AutoUpdate && (
        <AutoUpdateFieldset
          environmentType={environmentType}
          webhookId={webhookId || ''}
          baseWebhookUrl={baseWebhookUrl || ''}
          value={value.AutoUpdate}
          onChange={(value) => handleChange({ AutoUpdate: value })}
          isForcePullVisible={isForcePullVisible}
          webhooksDocs={webhooksDocs}
        />
      )}

      <TimeWindowDisplay />
    </FormSection>
  );

  function handleChange(partialValue: Partial<GitFormModel>) {
    onChange(partialValue);
    setValue((value) => ({ ...value, ...partialValue }));
  }
}

export async function validateGitForm(
  formValues: GitFormModel,
  deployMethod: DeployMethod = 'compose'
) {
  return validateForm<GitFormModel>(
    () => buildGitValidationSchema(deployMethod),
    formValues
  );
}

export function buildGitValidationSchema(
  deployMethod: DeployMethod
): SchemaOf<GitFormModel> {
  return object({
    RepositoryURL: string().optional(),
    RepositoryReferenceName: refFieldValidation(),
    ComposeFilePathInRepository: string().required(
      deployMethod === 'compose'
        ? '必须填写 Compose 文件路径'
        : '必须填写 Manifest 文件路径'
    ),
    AdditionalFiles: array(string().required('必须填写路径')).default([]),
    AutoUpdate: autoUpdateValidation().nullable(),
    SourceId: number()
      .min(1, '必须填写资源库')
      .required('必须填写资源库'),
  }) as SchemaOf<GitFormModel>;
}
