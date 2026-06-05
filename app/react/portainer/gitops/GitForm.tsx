import { array, boolean, object, SchemaOf, string } from 'yup';
import { FormikErrors } from 'formik';
import { useState } from 'react';

import { ComposePathField } from '@/react/portainer/gitops/ComposePathField';
import { RefField } from '@/react/portainer/gitops/RefField';
import { GitFormUrlField } from '@/react/portainer/gitops/GitFormUrlField';
import { DeployMethod, GitFormModel } from '@/react/portainer/gitops/types';
import { TimeWindowDisplay } from '@/react/portainer/gitops/TimeWindowDisplay';

import { FormSection } from '@@/form-components/FormSection';
import { validateForm } from '@@/form-components/validate-form';
import { SwitchField } from '@@/form-components/SwitchField';

import { GitCredential } from '../account/git-credentials/types';

import { AdditionalFileField } from './AdditionalFilesField';
import { gitAuthValidation, AuthFieldset } from './AuthFieldset';
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
  isAuthExplanationVisible?: boolean;
  errors?: FormikErrors<GitFormModel>;
  baseWebhookUrl?: string;
  webhookId?: string;
  webhooksDocs?: string;
  createdFromCustomTemplateId?: number;
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
  isAuthExplanationVisible,
  errors = {},
  baseWebhookUrl,
  webhookId,
  webhooksDocs,
  createdFromCustomTemplateId,
  isAutoUpdateVisible = true,
}: Props) {
  const [value, setValue] = useState(initialValue); // TODO: remove this state when form is not inside angularjs

  return (
    <FormSection title="Git 仓库">
      <AuthFieldset
        value={value}
        onChange={handleChange}
        isAuthExplanationVisible={isAuthExplanationVisible}
        errors={errors}
      />

      <GitFormUrlField
        value={value.RepositoryURL}
        onChange={(value) => handleChange({ RepositoryURL: value })}
        onChangeRepositoryValid={(value) =>
          handleChange({ RepositoryURLValid: value })
        }
        model={value}
        createdFromCustomTemplateId={createdFromCustomTemplateId}
        errors={errors.RepositoryURL}
      />

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="跳过 TLS 验证"
            data-cy="gitops-skip-tls-verification-switch"
            checked={value.TLSSkipVerify || false}
            onChange={(value) => handleChange({ TLSSkipVerify: value })}
            name="TLSSkipVerify"
            tooltip="启用后，将允许跳过任何自签名证书的 TLS 验证。"
            labelClass="col-sm-3 col-lg-2"
          />
        </div>
      </div>

      <RefField
        value={value.RepositoryReferenceName || ''}
        onChange={(value) => handleChange({ RepositoryReferenceName: value })}
        model={value}
        error={errors.RepositoryReferenceName}
        isUrlValid={value.RepositoryURLValid}
        createdFromCustomTemplateId={createdFromCustomTemplateId}
      />

      <ComposePathField
        value={value.ComposeFilePathInRepository}
        onChange={(value) =>
          handleChange({ ComposeFilePathInRepository: value })
        }
        isCompose={deployMethod === 'compose'}
        model={value}
        isDockerStandalone={isDockerStandalone}
        errors={errors.ComposeFilePathInRepository}
        createdFromCustomTemplateId={createdFromCustomTemplateId}
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
          errors={errors.AutoUpdate as FormikErrors<GitFormModel['AutoUpdate']>}
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
  gitCredentials: Array<GitCredential>,
  formValues: GitFormModel,
  isCreatedFromCustomTemplate: boolean,
  deployMethod: DeployMethod = 'compose'
) {
  return validateForm<GitFormModel>(
    () =>
      buildGitValidationSchema(
        gitCredentials,
        isCreatedFromCustomTemplate,
        deployMethod
      ),
    formValues
  );
}

export function buildGitValidationSchema(
  gitCredentials: Array<GitCredential>,
  isCreatedFromCustomTemplate: boolean,
  deployMethod: DeployMethod
): SchemaOf<GitFormModel> {
  return object({
    RepositoryURL: string()
      .test('valid URL', 'URL 必须是有效地址', (value) => {
        if (!value) {
          return true;
        }

        try {
          const url = new URL(value);
          return !!url.hostname;
        } catch {
          return false;
        }
      })
      .required('仓库 URL 为必填项'),
    RepositoryReferenceName: refFieldValidation(),
    ComposeFilePathInRepository: string().required(
      deployMethod === 'compose'
        ? 'Compose 文件路径为必填项'
        : 'Manifest 文件路径为必填项'
    ),
    AdditionalFiles: array(string().required('路径为必填项')).default([]),
    RepositoryURLValid: boolean().default(false),
    AutoUpdate: autoUpdateValidation().nullable(),
    TLSSkipVerify: boolean().default(false),
  }).concat(
    gitAuthValidation(gitCredentials, false, isCreatedFromCustomTemplate)
  ) as SchemaOf<GitFormModel>;
}
