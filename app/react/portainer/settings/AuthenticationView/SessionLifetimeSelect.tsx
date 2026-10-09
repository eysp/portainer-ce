import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

const sessionLifetimeOptions = [
  {
    key: '30 分钟',
    value: '30m',
  },
  {
    key: '1 小时',
    value: '1h',
  },
  {
    key: '4 小时',
    value: '4h',
  },
  {
    key: '8 小时',
    value: '8h',
  },
  {
    key: '24 小时',
    value: '24h',
  },
  { key: '1 周', value: "h" },
  { key: '1 个月', value: "h" },
  { key: '6 个月', value: "h" },
  { key: '1 年', value: "h" },
] as const;

export function getDefaultValue() {
  return sessionLifetimeOptions[0];
}

interface Props {
  value: string;
  onChange(value: string): void;
}

export function SessionLifetimeSelect({ value, onChange }: Props) {
  return (
    <FormControl
      inputId="user_timeout"
      label="会话生命周期"
      tooltip="强制用户重新登录前的时间。"
    >
      <Select
        id="user_timeout"
        data-cy="user-timeout-select"
        name="user_timeout"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={sessionLifetimeOptions.map((opt) => ({
          label: opt.key,
          value: opt.value,
        }))}
      />
    </FormControl>
  );
}
