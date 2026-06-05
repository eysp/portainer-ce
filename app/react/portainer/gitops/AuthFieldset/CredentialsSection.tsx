import { FormikErrors } from 'formik';

import { useDebounce } from '@/react/hooks/useDebounce';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { RadioGroup } from '@@/RadioGroup/RadioGroup';

import { AuthTypeOption } from '../../account/git-credentials/types';
import { isBE } from '../../feature-flags/feature-flags.service';
import { GitAuthModel } from '../types';

import { NewCredentialForm } from './NewCredentialForm';

export const defaultAuthTypeOptions = [
  {
    value: AuthTypeOption.Basic,
    label: 'Basic',
  },
  {
    value: AuthTypeOption.Token,
    label: 'Token',
  },
] as const;

export function CredentialsSection({
  value,
  onChange,
  errors,
}: {
  value: GitAuthModel;
  onChange: (value: Partial<GitAuthModel>) => void;
  errors?: FormikErrors<GitAuthModel>;
}) {
  const [username, setUsername] = useDebounce(
    value.RepositoryUsername || '',
    (username) => onChange({ RepositoryUsername: username })
  );
  const [password, setPassword] = useDebounce(
    value.RepositoryPassword || '',
    (password) => onChange({ RepositoryPassword: password })
  );
  const [authType, setAuthType] = useDebounce(
    value.RepositoryAuthorizationType || AuthTypeOption.Basic,
    (authType) => onChange({ RepositoryAuthorizationType: authType })
  );

  return (
    <>
      {isBE && (
        <div className="form-group">
          <div className="col-sm-12">
            <FormControl
              label="授权类型"
              tooltip="GitHub、GitLab 和 Bitbucket Cloud 需要使用 Basic Auth，即使使用 API 或访问令牌也是如此。"
            >
              <RadioGroup
                options={defaultAuthTypeOptions}
                selectedOption={authType}
                onOptionChange={(value) => setAuthType(value)}
                name="AuthorizationType"
              />
            </FormControl>
          </div>
        </div>
      )}

      <div className="form-group">
        <div className="col-sm-12">
          <FormControl label="用户名" errors={errors?.RepositoryUsername}>
            <Input
              value={username}
              name="repository_username"
              placeholder={
                value.RepositoryGitCredentialID ? '' : 'Git 用户名'
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
      {isBE && value.RepositoryPassword && (
        <NewCredentialForm value={value} onChange={onChange} errors={errors} />
      )}
    </>
  );
}
