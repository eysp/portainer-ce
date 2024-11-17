import { Settings } from '@/react/portainer/settings/types';

import { confirmDestructive } from '@@/modals/confirm';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { buildConfirmButton } from '@@/modals/utils';

import { PasswordLengthSlider } from './PasswordLengthSlider/PasswordLengthSlider';
import { SaveAuthSettingsButton } from './SaveAuthSettingsButton';

export interface Props {
  onSaveSettings(): void;
  isLoading: boolean;
  value: Settings['InternalAuthSettings'];
  onChange(value: number): void;
}

export function InternalAuth({
  onSaveSettings,
  isLoading,
  value,
  onChange,
}: Props) {
  async function onSubmit() {
    if (value.RequiredPasswordLength < 10) {
      const confirmed = await confirmDestructive({
        title: '允许弱密码吗？',
        message:
          '您设置了不安全的最低密码长度，这可能使系统容易受到攻击，您确定吗？',
        confirmButton: buildConfirmButton('是的', 'danger'),
      });

      if (confirmed) {
        onSaveSettings();
      }
    } else {
      onSaveSettings();
    }
  }

  return (
    <>
      <FormSectionTitle>信息</FormSectionTitle>
      <div className="form-group col-sm-12 text-muted small">
        使用内部认证时，Portainer将加密用户密码并将凭证存储在本地。
      </div>

      <FormSectionTitle>密码规则</FormSectionTitle>
      <div className="form-group col-sm-12 text-muted small">
        定义用户生成密码的最小长度。
      </div>

      <div className="form-group">
        <PasswordLengthSlider
          min={1}
          max={18}
          step={1}
          value={value.RequiredPasswordLength}
          onChange={onChange}
        />
      </div>

      <SaveAuthSettingsButton onSubmit={onSubmit} isLoading={isLoading} />
    </>
  );
}
