import { useEffect, useState } from 'react';

import { r2a } from '@/react-tools/react2angular';
import { useSettings } from '@/react/portainer/settings/queries';
import { withReactQuery } from '@/react-tools/withReactQuery';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

interface Props {
  value: number;
  onChange(value: number): void;
  isDefaultHidden?: boolean;
  label?: string;
  tooltip?: string;
  readonly?: boolean;
}

export const checkinIntervalOptions = [
  { label: '使用默认间隔', value: 0 },
  {
    label: '5 秒',
    value: 5,
  },
  {
    label: '10 秒',
    value: 10,
  },
  {
    label: '30 秒',
    value: 30,
  },
  { label: '5 分钟', value: 300 },
  { label: '1 小时', value: 3600 },
  { label: '1 天', value: 86400 },
];

export function EdgeCheckinIntervalField({
  value,
  readonly,
  onChange,
  isDefaultHidden = false,
  label = '轮询频率',
  tooltip = '该Edge代理用于与Portainer实例签到的时间间隔。影响Edge环境管理和Edge计算功能。',
}: Props) {
  const options = useOptions(isDefaultHidden);

  return (
    <FormControl inputId="edge_checkin" label={label} tooltip={tooltip}>
      <Select
        value={value}
        onChange={(e) => {
          onChange(parseInt(e.currentTarget.value, 10));
        }}
        options={options}
        disabled={readonly}
      />
    </FormControl>
  );
}

export const EdgeCheckinIntervalFieldAngular = r2a(
  withReactQuery(EdgeCheckinIntervalField),
  ['value', 'onChange', 'isDefaultHidden', 'tooltip', 'label', 'readonly']
);

function useOptions(isDefaultHidden: boolean) {
  const [options, setOptions] = useState(checkinIntervalOptions);

  const settingsQuery = useSettings(
    (settings) => settings.EdgeAgentCheckinInterval
  );

  useEffect(() => {
    if (isDefaultHidden) {
      setOptions(checkinIntervalOptions.filter((option) => option.value !== 0));
    }

    if (!isDefaultHidden && typeof settingsQuery.data !== 'undefined') {
      setOptions((options) => {
        let label = `${settingsQuery.data} seconds`;
        const option = options.find((o) => o.value === settingsQuery.data);
        if (option) {
          label = option.label;
        }

        return [
          {
            value: 0,
            label: `使用默认间隔 (${label})`,
          },
          ...options.slice(1),
        ];
      });
    }
  }, [settingsQuery.data, setOptions, isDefaultHidden]);

  return options;
}
