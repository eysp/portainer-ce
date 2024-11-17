import { GitCredential } from '@/react/portainer/account/git-credentials/types';
import { useGitCredentials } from '@/react/portainer/account/git-credentials/git-credentials.service';
import { useUser } from '@/react/hooks/useUser';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/ReactSelect';

export function CredentialSelector({
  value,
  onChange,
  error,
}: {
  value?: number;
  onChange(gitCredential?: GitCredential | null): void;
  error?: string;
}) {
  const { user } = useUser();

  const gitCredentialsQuery = useGitCredentials(user.Id);

  const gitCredentials = gitCredentialsQuery.data ?? [];

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <FormControl
          label="Git 凭证"
          inputId="git-creds-selector"
          errors={error}
        >
          <Select
            placeholder="选择 Git 凭证或在下方填写"
            value={gitCredentials.find(
              (gitCredential) => gitCredential.id === value
            )}
            options={gitCredentials}
            getOptionLabel={(gitCredential) => gitCredential.name}
            getOptionValue={(gitCredential) => gitCredential.id.toString()}
            onChange={onChange}
            isClearable
            noOptionsMessage={() => '没有保存的凭证'}
            inputId="git-creds-selector"
          />
        </FormControl>
      </div>
    </div>
  );
}
