import { FormControl, Size } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

import { Options, useIntervalOptions } from './useIntervalOptions';

interface Props {
  value: number;
  onChange(value: number): void;
  isDefaultHidden?: boolean;
  label?: string;
  tooltip?: string;
  readonly?: boolean;
  size?: Size;
}

export const checkinIntervalOptions: Options = [
  { label: '使用默认间隔', value: 0, isDefault: true },
  { label: '5秒', value: 5 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '5分钟', value: 300 },
  { label: '1小时', value: 3600 },
  { label: '1天', value: 86400 },
];

export function EdgeCheckinIntervalField({
  value,
  readonly,
  onChange,
  isDefaultHidden = false,
  label = '轮询频率',
  tooltip = '此 Edge 代理用于与 Portainer 实例进行签入的间隔。影响 Edge 环境管理和 Edge 计算功能。',
  size = 'small',
}: Props) {
  const options = useIntervalOptions(
    'EdgeAgentCheckinInterval',
    checkinIntervalOptions,
    isDefaultHidden
  );

  return (
    <FormControl
      inputId="edge_checkin"
      label={label}
      tooltip={tooltip}
      size={size}
    >
      <Select
        value={value}
        onChange={(e) => {
          onChange(parseInt(e.currentTarget.value, 10));
        }}
        options={options}
        disabled={readonly}
        id="edge_checkin"
      />
    </FormControl>
  );
}
