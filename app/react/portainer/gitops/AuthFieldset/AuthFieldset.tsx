import { FormikErrors } from 'formik';
import { boolean, number, object, SchemaOf, string } from 'yup';

import { GitAuthModel } from '@/react/portainer/gitops/types';
import { useDebounce } from '@/react/hooks/useDebounce';
import { GitCredential } from '@/react/portainer/account/git-credentials/types';

import { SwitchField } from '@@/form-components/SwitchField';
import { Input } from '@@/form-components/Input';
import { FormControl } from '@@/form-components/FormControl';
import { TextTip } from '@@/Tip/TextTip';

import { isBE } from '../../feature-flags/feature-flags.service';

import { CredentialSelector } from './CredentialSelector';
import { NewCredentialForm } from './NewCredentialForm';

interface Props {
  value: GitAuthModel;
  onChange: (value: Partial<GitAuthModel>) => void;
  isAuthExplanationVisible?: boolean;
  errors?: FormikErrors<GitAuthModel>;
}

export function AuthFieldset({
  value,
  onChange,
  isAuthExplanationVisible,
  errors,
}: Props) {
  const [username, setUsername] = useDebounce(
    value.RepositoryUsername || '',
    (username) => handleChange({ RepositoryUsername: username })
  );
  const [password, setPassword] = useDebounce(
    value.RepositoryPassword || '',
    (password) => handleChange({ RepositoryPassword: password })
  );

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="认证"
            labelClass="col-sm-3 col-lg-2"
            name="authentication"
            checked={value.RepositoryAuthentication}
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
              启用身份验证将存储凭据，建议使用git服务帐户
            </TextTip>
          )}

          {isBE && (
            <CredentialSelector
              onChange={handleChangeGitCredential}
              value={value.RepositoryGitCredentialID}
            />
          )}

          <div className="form-group">
            <div className="col-sm-12">
              <FormControl label="用户名" errors={errors?.RepositoryUsername}>
                <Input
                  value={username}
                  name="repository_username"
                  placeholder={
                    value.RepositoryGitCredentialID ? '' : 'git username'
                  }
                  onChange={(e) => setUsername(e.target.value)}
                  data-cy="component-gitUsernameInput"
                  readOnly={!!value.RepositoryGitCredentialID}
                />
              </FormControl>
            </div>
          </div>
          <div className="form-group !mb-0">
            <div className="col-sm-12">
              <FormControl
                label="个人访问令牌"
                tooltip="提供个人访问令牌或密码"
                errors={errors?.RepositoryPassword}
              >
                <Input
                  type="password"
                  value={password}
                  name="repository_password"
                  placeholder="*******"
                  onChange={(e) => setPassword(e.target.value)}
                  data-cy="component-gitPasswordInput"
                  readOnly={!!value.RepositoryGitCredentialID}
                />
              </FormControl>
            </div>
          </div>
          {!value.RepositoryGitCredentialID &&
            value.RepositoryPassword &&
            isBE && (
              <NewCredentialForm
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
  }
}

export function gitAuthValidation(
  gitCredentials: Array<GitCredential>,
  isAuthEdit: boolean
): SchemaOf<GitAuthModel> {
  return object({
    RepositoryAuthentication: boolean().default(false),
    RepositoryGitCredentialID: number().default(0),
    RepositoryUsername: string()
      .when(['RepositoryAuthentication', 'RepositoryGitCredentialID'], {
        is: (auth: boolean, id: number) => auth && !id,
        then: string().required('需要提供用户名'),
      })
      .default(''),
    RepositoryPassword: string()
      .when(['RepositoryAuthentication', 'RepositoryGitCredentialID'], {
        is: (auth: boolean, id: number) => auth && !id && !isAuthEdit,
        then: string().required('需要提供密码'),
      })
      .default(''),
    SaveCredential: boolean().default(false),
    NewCredentialName: string()
      .default('')
      .when(['RepositoryAuthentication', 'SaveCredential'], {
        is: true,
        then: string()
          .required('需要提供名称')
          .test(
            'is-unique',
            '该名称已被使用，请尝试其他名称',
            (name) => !!name && !gitCredentials.find((x) => x.name === name)
          )
          .matches(
            /^[-_a-z0-9]+$/,
            "该字段只能包含小写字母、数字、'_'或'-'（例如：'my-name'或'abc-123'）。"
          ),
      }),
  });
}
