import { number, object, SchemaOf } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

import { Options, useIntervalOptions } from './useIntervalOptions';

export const EDGE_ASYNC_INTERVAL_USE_DEFAULT = -1;

export interface EdgeAsyncIntervalsValues {
  PingInterval: number;
  SnapshotInterval: number;
  CommandInterval: number;
}

export const options: Options = [
  { label: '使用默认间隔', value: -1, isDefault: true },
  { value: 0, label: '禁用' },
  { value: 60, label: '1分钟' },
  { value: 60 * 60, label: '1小时' },
  { value: 24 * 60 * 60, label: '1天' },
  { value: 7 * 24 * 60 * 60, label: '1周' },
];

const defaultFieldSettings = {
  ping: {
    label: 'Ping间隔',
    tooltip: '此 Edge 代理用于与 Portainer 实例签入的间隔',
  },
  snapshot: {
    label: '快照间隔',
    tooltip: '此 Edge 代理用于对代理状态进行快照的间隔',
  },
  command: {
    label: '命令间隔',
    tooltip: '此 Edge 代理用于从 Portainer 实例获取命令的间隔',
  },
};

interface Props {
  values: EdgeAsyncIntervalsValues;
  isDefaultHidden?: boolean;
  readonly?: boolean;
  fieldSettings?: typeof defaultFieldSettings;
  onChange(value: EdgeAsyncIntervalsValues): void;
}

export function EdgeAsyncIntervalsForm({
  onChange,
  values,
  isDefaultHidden = false,
  readonly = false,
  fieldSettings = defaultFieldSettings,
}: Props) {
  const pingIntervalOptions = useIntervalOptions(
    'Edge.PingInterval',
    options,
    isDefaultHidden
  );

  const snapshotIntervalOptions = useIntervalOptions(
    'Edge.SnapshotInterval',
    options,
    isDefaultHidden
  );

  const commandIntervalOptions = useIntervalOptions(
    'Edge.CommandInterval',
    options,
    isDefaultHidden
  );

  return (
    <>
      <FormControl
        inputId="edge_checkin_ping"
        label={fieldSettings.ping.label}
        tooltip={fieldSettings.ping.tooltip}
      >
        <Select
          value={values.PingInterval}
          name="PingInterval"
          onChange={handleChange}
          options={pingIntervalOptions}
          disabled={readonly}
        />
      </FormControl>

      <FormControl
        inputId="edge_checkin_snapshot"
        label={fieldSettings.snapshot.label}
        tooltip={fieldSettings.snapshot.tooltip}
      >
        <Select
          value={values.SnapshotInterval}
          name="SnapshotInterval"
          onChange={handleChange}
          options={snapshotIntervalOptions}
          disabled={readonly}
        />
      </FormControl>

      <FormControl
        inputId="edge_checkin_command"
        label={fieldSettings.command.label}
        tooltip={fieldSettings.command.tooltip}
      >
        <Select
          value={values.CommandInterval}
          name="CommandInterval"
          onChange={handleChange}
          options={commandIntervalOptions}
          disabled={readonly}
        />
      </FormControl>
    </>
  );

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ ...values, [e.target.name]: parseInt(e.target.value, 10) });
  }
}

const intervals = options.map((option) => option.value);

export function edgeAsyncIntervalsValidation(): SchemaOf<EdgeAsyncIntervalsValues> {
  return object({
    PingInterval: number().required('此字段为必填项。').oneOf(intervals),
    SnapshotInterval: number()
      .required('此字段为必填项。')
      .oneOf(intervals),
    CommandInterval: number()
      .required('此字段为必填项。')
      .oneOf(intervals),
  });
}
