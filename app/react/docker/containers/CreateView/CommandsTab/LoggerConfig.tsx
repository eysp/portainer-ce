import { FormikErrors } from 'formik';
import { array, object, SchemaOf, string } from 'yup';
import _ from 'lodash';

import { useLoggingPlugins } from '@/react/docker/proxy/queries/usePlugins';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useIsPodman } from '@/react/portainer/environments/queries/useIsPodman';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { InputGroup } from '@@/form-components/InputGroup';
import { InputList, ItemProps } from '@@/form-components/InputList';
import { PortainerSelect } from '@@/form-components/PortainerSelect';
import { TextTip } from '@@/Tip/TextTip';
import { FormError } from '@@/form-components/FormError';

export interface LogConfig {
  type: string;
  options: Array<{ option: string; value: string }>;
}

export function LoggerConfig({
  value,
  onChange,
  apiVersion,
  errors,
}: {
  value: LogConfig;
  onChange: (value: LogConfig) => void;
  apiVersion: number;
  errors?: FormikErrors<LogConfig>;
}) {
  const envId = useEnvironmentId();
  const isPodman = useIsPodman(envId);
  const isSystem = apiVersion < 1.25;
  const pluginsQuery = useLoggingPlugins(envId, isSystem, isPodman);

  if (!pluginsQuery.data) {
    return null;
  }

  const isDisabled = !value.type || value.type === 'none';

  const pluginOptions = [
    { label: '默认日志驱动 (Default)', value: '' },
    ...pluginsQuery.data.map((p) => ({ label: p, value: p })),
    { label: 'none', value: 'none' },
  ];

  return (
    <FormSection title="日志驱动配置">
      <FormControl label="日志驱动 (Driver)">
        <PortainerSelect
          value={value.type}
          onChange={(type) => onChange({ ...value, type: type || '' })}
          options={pluginOptions}
          data-cy="docker-logging-driver-selector"
        />
      </FormControl>

      <TextTip color="blue">
        用于覆盖 Docker 守护进程默认配置的日志驱动。如果您不想覆盖，请选择“默认日志驱动”。支持的日志驱动可查阅{' '}
        <a
          href="https://docs.docker.com/engine/logging/configure/#supported-logging-drivers"
          target="_blank"
          rel="noreferrer"
        >
          Docker 官方文档
        </a>
        。
      </TextTip>

      <InputList
        tooltip={
          isDisabled
            ? '仅当选择了除 none 或默认以外的驱动时，添加按钮才可用。具体选项因所选驱动而异，请参阅驱动文档。'
            : ''
        }
        label="驱动选项 (Options)"
        onChange={(options) => handleChange({ options })}
        value={value.options}
        item={Item}
        itemBuilder={() => ({ option: '', value: '' })}
        disabled={isDisabled}
        errors={errors?.options}
        data-cy="docker-logging-options"
      />
    </FormSection>
  );

  function handleChange(partial: Partial<LogConfig>) {
    onChange({ ...value, ...partial });
  }
}

function Item({
  item: { option, value },
  onChange,
  error,
  index,
}: ItemProps<{ option: string; value: string }>) {
  return (
    <div>
      <div className="flex w-full gap-4">
        <InputGroup className="w-1/2">
          <InputGroup.Addon>选项名 (option)</InputGroup.Addon>
          <InputGroup.Input
            value={option}
            onChange={(e) => handleChange({ option: e.target.value })}
            placeholder="e.g. FOO"
            data-cy={`docker-logging-option_${index}`}
          />
        </InputGroup>
        <InputGroup className="w-1/2">
          <InputGroup.Addon>选项值 (value)</InputGroup.Addon>
          <InputGroup.Input
            value={value}
            onChange={(e) => handleChange({ value: e.target.value })}
            placeholder="e.g bar"
            data-cy={`docker-logging-value_${index}`}
          />
        </InputGroup>
      </div>
      {error && <FormError>{_.first(Object.values(error))}</FormError>}
    </div>
  );

  function handleChange(partial: Partial<{ option: string; value: string }>) {
    onChange({ option, value, ...partial });
  }
}

export function validation(): SchemaOf<LogConfig> {
  return object({
    options: array().of(
      object({
        option: string().required('选项名不能为空'),
        value: string().required('选项值不能为空'),
      })
    ),
    type: string().default(''),
  });
}
