import { confirmDestructive } from '@/portainer/services/modal.service/confirm';
import { Settings } from '@/react/portainer/settings/types';

import { FormSectionTitle } from '@@/form-components/FormSectionTitle';

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
  function onSubmit() {
    if (value.RequiredPasswordLength < 10) {
      confirmDestructive({
        title: '是否允许弱密码？',
        message:
          '你设置了一个不安全的最小密码长度。这可能使你的系统容易受到攻击，你确定吗？',
        buttons: {
          confirm: {
            label: '是的',
            className: 'btn-danger',
          },
        },
        callback: function onConfirm(confirmed) {
          if (confirmed) onSaveSettings();
        },
      });
    } else {
      onSaveSettings();
    }
  }

  return (
    <>
      <FormSectionTitle>信息</FormSectionTitle>
      <div className="form-group col-sm-12 text-muted small">
      当使用内部认证时，Portainer将加密用户的
        密码并在本地存储证书。
      </div>

      <FormSectionTitle>密码规则</FormSectionTitle>
      <div className="form-group col-sm-12 text-muted small">
      定义用户生成的密码的最小长度。
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
