import { FormikErrors } from 'formik';

import { Checkbox } from '@@/form-components/Checkbox';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { TextTip } from '@@/Tip/TextTip';

import { GitAuthModel } from '../types';

export function NewCredentialForm({
  value,
  onChange,
  errors,
}: {
  value: GitAuthModel;
  onChange: (value: Partial<GitAuthModel>) => void;
  errors?: FormikErrors<GitAuthModel>;
}) {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <FormControl label="">
          <div className="flex items-center gap-2">
            <Checkbox
              id="repository-save-credential"
              label="保存凭证"
              checked={value.SaveCredential || false}
              className="[&+label]:mb-0"
              onChange={(e) => onChange({ SaveCredential: e.target.checked })}
            />
            <Input
              value={value.NewCredentialName || ''}
              name="new_credential_name"
              placeholder="凭证名称"
              className="ml-4 w-48"
              onChange={(e) => onChange({ NewCredentialName: e.target.value })}
              disabled={!value.SaveCredential}
            />
            {errors?.NewCredentialName && (
              <div className="small text-danger">
                {errors.NewCredentialName}
              </div>
            )}

            {value.SaveCredential && (
              <TextTip color="blue">
                这个 Git 凭证可以通过您的账户页面进行管理
              </TextTip>
            )}
          </div>
        </FormControl>
      </div>
    </div>
  );
}
