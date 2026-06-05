import { FormikErrors } from 'formik';
import { boolean, mixed, number, object, SchemaOf, string } from 'yup';
import { useState } from 'react';

import { GitAuthModel } from '@/react/portainer/gitops/types';
import {
  AuthTypeOption,
  GitCredential,
} from '@/react/portainer/account/git-credentials/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

import { isBE } from '../../feature-flags/feature-flags.service';

import { CredentialSelector } from './CredentialSelector';
import { CredentialsSection } from './CredentialsSection';

interface Props {
  value: GitAuthModel;
  onChange: (value: Partial<GitAuthModel>) => void;
  isAuthExplanationVisible?: boolean;
  errors?: FormikErrors<GitAuthModel>;
}

export function AuthFieldset({
  value: initialValue,
  onChange,
  isAuthExplanationVisible,
  errors,
}: Props) {
  const [value, setValue] = useState(initialValue); // TODO: remove this state when form is not inside angularjs

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="身份验证"
            labelClass="col-sm-3 col-lg-2"
            name="authentication"
            checked={value.RepositoryAuthentication || false}
            onChange={(value) =>
              handleChange({ RepositoryAuthentication: value })
            }
            data-cy="component-gitAuthToggle"
          />
        </div>
      </div>

      {value.RepositoryAuthentication && (
        <>
          {isAuthExplanationVisible && (
            <TextTip color="orange" className="mb-2">
              启用身份验证会存储凭据，建议使用 Git 服务账户。
            </TextTip>
          )}

          {isBE && (
            <CredentialSelector
              onChange={handleChangeGitCredential}
              value={value.RepositoryGitCredentialID}
            />
          )}

          {!value.RepositoryGitCredentialID && (
            <CredentialsSection
              value={value}
              onChange={handleChange}
              errors={errors}
            />
          )}
        </>
      )}
    </>
  );

  function handleChangeGitCredential(gitCredential?: GitCredential | null) {
    handleChange(
      gitCredential
        ? {
            RepositoryGitCredentialID: gitCredential.id,
            RepositoryUsername: gitCredential?.username,
            RepositoryPassword: '',
            SaveCredential: false,
            NewCredentialName: '',
          }
        : {
            RepositoryGitCredentialID: 0,
            RepositoryUsername: '',
            RepositoryPassword: '',
          }
    );
  }

  function handleChange(partialValue: Partial<GitAuthModel>) {
    onChange(partialValue);
    setValue((value) => ({ ...value, ...partialValue }));
  }
}

export function gitAuthValidation(
  gitCredentials: Array<GitCredential>,
  isAuthEdit: boolean,
  isCreatedFromCustomTemplate: boolean
): SchemaOf<GitAuthModel> {
  return object({
    RepositoryAuthentication: boolean().default(false),
    RepositoryGitCredentialID: number().default(0),
    RepositoryUsername: string()
      .when(['RepositoryAuthentication', 'RepositoryGitCredentialID'], {
        is: (auth: boolean, id: number) => auth && !id,
        then: string().required('用户名为必填项'),
      })
      .default(''),
    RepositoryPassword: string()
      .when(['RepositoryAuthentication', 'RepositoryGitCredentialID'], {
        is: (auth: boolean, id: number) =>
          auth && !id && !isAuthEdit && !isCreatedFromCustomTemplate,
        then: string().required('个人访问令牌为必填项'),
      })
      .default(''),
    RepositoryAuthorizationType: mixed()
      .oneOf(Object.values(AuthTypeOption))
      .when(['RepositoryAuthentication', 'RepositoryGitCredentialID'], {
        is: (auth: boolean, id: number) =>
          isBE && auth && !id && !isAuthEdit && !isCreatedFromCustomTemplate,
        then: mixed().required('授权类型为必填项'),
      })
      .default(AuthTypeOption.Basic),
    SaveCredential: boolean().default(false),
    NewCredentialName: string()
      .default('')
      .when(['RepositoryAuthentication', 'SaveCredential'], {
        is: (RepositoryAuthentication: boolean, SaveCredential: boolean) =>
          RepositoryAuthentication && SaveCredential && !isAuthEdit,
        then: string()
          .required('名称为必填项')
          .test(
            'is-unique',
            '该名称已被使用，请尝试其他名称',
            (name) => !!name && !gitCredentials.find((x) => x.name === name)
          )
          .matches(
            /^[-_a-z0-9]+$/,
            "此字段只能包含小写字母、数字、'_' 或 '-'（例如 'my-name' 或 'abc-123'）。"
          ),
      }),
  });
}
