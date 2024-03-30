import { useMemo } from 'react';
import { components, MultiValue } from 'react-select';
import { MultiValueRemoveProps } from 'react-select/dist/declarations/src/components/MultiValue';
import {
  ActionMeta,
  OnChangeValue,
} from 'react-select/dist/declarations/src/types';
import { OptionProps } from 'react-select/dist/declarations/src/components/Option';

import { Select } from '@@/form-components/ReactSelect';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { Tooltip } from '@@/Tip/Tooltip';
import { TextTip } from '@@/Tip/TextTip';

interface Values {
  enabled: boolean;
  useSpecific: boolean;
  selectedGPUs: string[];
  capabilities: string[];
}

interface GpuOption {
  value: string;
  label: string;
  description?: string;
}

export interface GPU {
  value: string;
  name: string;
}

export interface Props {
  values: Values;
  onChange(values: Values): void;
  gpus: GPU[];
  usedGpus: string[];
  usedAllGpus: boolean;
  enableGpuManagement?: boolean;
}

const NvidiaCapabilitiesOptions = [
  // 从 https://github.com/containerd/containerd/blob/master/contrib/nvidia/nvidia.go#L40 获取
  {
    value: 'compute',
    label: 'compute',
    description: '用于 CUDA 和 OpenCL 应用程序',
  },
  {
    value: 'compat32',
    label: 'compat32',
    description: '用于运行 32 位应用程序',
  },
  {
    value: 'graphics',
    label: 'graphics',
    description: '用于运行 OpenGL 和 Vulkan 应用程序',
  },
  {
    value: 'utility',
    label: 'utility',
    description: '用于使用 nvidia-smi 和 NVML',
  },
  {
    value: 'video',
    label: 'video',
    description: '用于使用视频编解码器 SDK',
  },
  {
    value: 'display',
    label: 'display',
    description: '用于利用 X11 显示',
  },
];

function Option(props: OptionProps<GpuOption, true>) {
  const {
    data: { value, description },
  } = props;

  return (
    <div>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <components.Option {...props}>
        {`${value} - ${description}`}
      </components.Option>
    </div>
  );
}

function MultiValueRemove(props: MultiValueRemoveProps<GpuOption, true>) {
  const {
    selectProps: { value },
  } = props;
  if (value && (value as MultiValue<GpuOption>).length === 1) {
    return null;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <components.MultiValueRemove {...props} />;
}

export function Gpu({
  values,
  onChange,
  gpus = [],
  usedGpus = [],
  usedAllGpus,
  enableGpuManagement,
}: Props) {
  const options = useMemo(() => {
    const options = (gpus || []).map((gpu) => ({
      value: gpu.value,
      label:
        usedGpus.includes(gpu.value) || usedAllGpus
          ? `${gpu.name} (in use)`
          : gpu.name,
    }));

    options.unshift({
      value: 'all',
      label: '使用所有 GPUs',
    });

    return options;
  }, [gpus, usedGpus, usedAllGpus]);

  function onChangeValues(key: string, newValue: boolean | string[]) {
    const newValues = {
      ...values,
      [key]: newValue,
    };
    onChange(newValues);
  }

  function toggleEnableGpu() {
    onChangeValues('enabled', !values.enabled);
  }

  function onChangeSelectedGpus(
    newValue: OnChangeValue<GpuOption, true>,
    actionMeta: ActionMeta<GpuOption>
  ) {
    let { useSpecific } = values;
    let selectedGPUs = newValue.map((option) => option.value);

    if (actionMeta.action === 'select-option') {
      useSpecific = actionMeta.option?.value !== 'all';
      selectedGPUs = selectedGPUs.filter((value) =>
        useSpecific ? value !== 'all' : value === 'all'
      );
    }

    const newValues = { ...values, selectedGPUs, useSpecific };
    onChange(newValues);
  }

  function onChangeSelectedCaps(newValue: OnChangeValue<GpuOption, true>) {
    onChangeValues(
      'capabilities',
      newValue.map((option) => option.value)
    );
  }

  const gpuCmd = useMemo(() => {
    const devices = values.selectedGPUs.join(',');
    const deviceStr = devices === 'all' ? 'all,' : `device=${devices},`;
    const caps = values.capabilities.join(',');
    return `--gpus '${deviceStr}"capabilities=${caps}"'`;
  }, [values.selectedGPUs, values.capabilities]);

  const gpuValue = useMemo(
    () =>
      options.filter((option) => values.selectedGPUs.includes(option.value)),
    [values.selectedGPUs, options]
  );

  const capValue = useMemo(
    () =>
      NvidiaCapabilitiesOptions.filter((option) =>
        values.capabilities.includes(option.value)
      ),
    [values.capabilities]
  );

  return (
    <div>
      {!enableGpuManagement && (
        <TextTip color="blue">
        UI 中的 GPU 目前未在此环境中启用。
      </TextTip>
      )}
      <div className="form-group">
        <div className="col-sm-3 col-lg-2 control-label text-left">
          启用 GPU
          <Switch
            id="enabled"
            name="enabled"
            checked={values.enabled && !!enableGpuManagement}
            onChange={toggleEnableGpu}
            className="ml-2"
            disabled={enableGpuManagement === false}
          />
        </div>
        {enableGpuManagement && values.enabled && (
          <div className="col-sm-9 col-lg-10 text-left">
            <Select<GpuOption, true>
              isMulti
              closeMenuOnSelect
              value={gpuValue}
              isClearable={false}
              backspaceRemovesValue={false}
              isDisabled={!values.enabled}
              onChange={onChangeSelectedGpus}
              options={options}
              components={{ MultiValueRemove }}
            />
          </div>
        )}
      </div>

      {values.enabled && (
        <>
          <div className="form-group">
            <div className="col-sm-3 col-lg-2 control-label text-left">
              能力
              <Tooltip message="‘compute’ 和 ‘utility’ 能力由 Portainer 预先选择，因为它们是默认使用的，当您没有使用 docker CLI 的 ‘--gpus’ 选项明确指定能力时。" />
            </div>
            <div className="col-sm-9 col-lg-10 text-left">
              <Select<GpuOption, true>
                isMulti
                closeMenuOnSelect
                value={capValue}
                options={NvidiaCapabilitiesOptions}
                components={{ Option }}
                onChange={onChangeSelectedCaps}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-3 col-lg-2 control-label text-left">
              控制
              <Tooltip message="这是基于您的设置生成的 '--gpus' docker CLI 参数的等效值" />
            </div>
            <div className="col-sm-9 col-lg-10">
              <code>{gpuCmd}</code>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
