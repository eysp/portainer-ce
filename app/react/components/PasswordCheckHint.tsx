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
        <Icon icon="alert-triangle" className="icon-warning" feather />
        {forceChangePassword &&
          '管理员已经改变了你的密码要求， '}
        密码必须至少是 {minPasswordLength} 字符的长度。
        {passwordValid && (
          <i className="fa fa-check green-icon space-left" aria-hidden="true" />
        )}
      </p>
    </div>
  );
}
