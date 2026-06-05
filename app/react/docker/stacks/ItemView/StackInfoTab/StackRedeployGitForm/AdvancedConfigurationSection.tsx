import { MinusIcon, PlusIcon } from 'lucide-react';
import { useReducer } from 'react';
import { useFormikContext } from 'formik';

import { Stack } from '@/react/common/stacks/types';
import { AuthFieldset } from '@/react/portainer/gitops/AuthFieldset';
import { RefField } from '@/react/portainer/gitops/RefField';
import { RelativePathFieldset } from '@/react/portainer/gitops/RelativePathFieldset/RelativePathFieldset';
import { RelativePathModel } from '@/react/portainer/gitops/types';
import { RefFieldModel } from '@/react/portainer/gitops/RefField/types';

import { Icon } from '@@/Icon';
import { Button } from '@@/buttons';

import { FormValues } from './types';
import { TLSVerificationField } from './TLSVerificationField';

interface Props {
  stack: Stack;
}

export function AdvancedConfigurationSection({ stack }: Props) {
  const { values, setFieldValue, errors, initialValues } =
    useFormikContext<FormValues>();
  const [isAdvancedMode, toggleAdvancedMode] = useReducer(
    (state) => !state,
    false
  );

  const gitConfig = stack.GitConfig;

  if (!gitConfig) {
    return null;
  }

  const valuesToPassDownToFields: RefFieldModel = {
    RepositoryURL: gitConfig.URL || '',
    RepositoryAuthentication: values.auth.RepositoryAuthentication,
    RepositoryAuthorizationType: values.auth.RepositoryAuthorizationType,
    RepositoryGitCredentialID: values.auth.RepositoryGitCredentialID,
    RepositoryUsername: values.auth.RepositoryUsername,
    RepositoryPassword: values.auth.RepositoryPassword,
    TLSSkipVerify: values.tlsSkipVerify,
  };

  const relativePathValues: RelativePathModel = {
    FilesystemPath: stack.FilesystemPath,
    SupportRelativePath: stack.SupportRelativePath,
    PerDeviceConfigsGroupMatchType: '',
    SupportPerDeviceConfigs: false,
    PerDeviceConfigsMatchType: '',
    PerDeviceConfigsPath: '',
  };

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <Button
            color="none"
            onClick={() => toggleAdvancedMode()}
            data-cy="advanced-configuration-toggle-button"
          >
            <Icon
              icon={isAdvancedMode ? MinusIcon : PlusIcon}
              className="mr-1"
            />
            {isAdvancedMode ? 'Hide' : 'Advanced'} configuration
          </Button>
        </div>
      </div>

      {isAdvancedMode && (
        <>
          <RefField
            value={values.refName}
            onChange={(value) => setFieldValue('refName', value)}
            model={valuesToPassDownToFields}
            isUrlValid
            stackId={stack.Id}
            error={errors.refName}
          />

          <AuthFieldset
            value={values.auth}
            onChange={(value) => {
              Object.entries(value).forEach(([key, val]) => {
                setFieldValue(`auth.${key}`, val);
              });
            }}
            isAuthExplanationVisible
            errors={errors.auth}
          />

          <TLSVerificationField
            value={values.tlsSkipVerify}
            initialValue={initialValues.tlsSkipVerify}
            onChange={(value) => setFieldValue('tlsSkipVerify', value)}
          />

          <RelativePathFieldset
            values={relativePathValues}
            gitModel={valuesToPassDownToFields}
            isEditing
            hideEdgeConfigs
            onChange={() => {}}
          />
        </>
      )}
    </>
  );
}
