import { AlertTriangle, Check } from 'lucide-react';

import { usePublicSettings } from '@/react/portainer/settings/queries';

import { Icon } from '@@/Icon';

interface Props {
  passwordValid: boolean;
  forceChangePassword?: boolean;
}

export function PasswordCheckHint({
  passwordValid,
  forceChangePassword,
}: Props) {
  const settingsQuery = usePublicSettings();
  const minPasswordLength = settingsQuery.data?.RequiredPasswordLength;

  return (
    <div>
      <p className="text-warning vertical-center">
        <Icon icon={AlertTriangle} className="icon-warning" />
        {forceChangePassword &&
          '管理员已更改您的密码要求， '}
        密码长度必须至少为 {minPasswordLength} 个字符。
        {passwordValid && (
          <Icon icon={Check} className="!ml-1" mode="success" />
        )}
      </p>
    </div>
  );
}
