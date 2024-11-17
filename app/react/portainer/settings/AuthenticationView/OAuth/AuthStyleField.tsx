import { Options } from '@/react/edge/components/useIntervalOptions';
import { OAuthStyle } from '@/react/portainer/settings/types';

import { FormControl, Size } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

interface Props {
  value: OAuthStyle;
  onChange(value: OAuthStyle): void;
  label?: string;
  tooltip?: string;
  readonly?: boolean;
  size?: Size;
}

// The options are based on oauth2 lib definition @https://pkg.go.dev/golang.org/x/oauth2#AuthStyle
export const authStyleOptions: Options = [
  { label: '自动检测', value: OAuthStyle.AutoDetect, isDefault: true },
  { label: '在参数中', value: OAuthStyle.InParams },
  { label: '在头部', value: OAuthStyle.InHeader },
];

export function AuthStyleField({
  value,
  readonly = false,
  onChange,
  label = '认证样式',
  tooltip = '认证样式指定端点希望如何发送客户端ID和客户端密钥。',
  size = 'small',
}: Props) {
  return (
    <FormControl
      inputId="oauth_authstyle"
      label={label}
      tooltip={tooltip}
      size={size}
    >
      <Select
        value={value}
        onChange={(e) => {
          onChange(parseInt(e.currentTarget.value, 10));
        }}
        options={authStyleOptions}
        disabled={readonly}
        id="oauth_authstyle"
      />
    </FormControl>
  );
}
