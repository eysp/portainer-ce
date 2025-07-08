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

import { Values } from './types';

interface GpuOption {
  value: string;
  label: string;
  description?: string;
}

interface GPU {
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
  // Taken from https://github.com/containerd/containerd/blob/master/contrib/nvidia/nvidia.go#L40
  {
    value: 'compute',
    label: 'compute',
    description: 'required for CUDA and OpenCL applications',
  },
  {
    value: 'compat32',
    label: 'compat32',
    description: 'required for running 32-bit applications',
  },
  {
    value: 'graphics',
    label: 'graphics',
    description: 'required for running OpenGL and Vulkan applications',
  },
  {
    value: 'utility',
    label: 'utility',
    description: 'required for using nvidia-smi and NVML',
  },
  {
    value: 'video',
    label: 'video',
    description: 'required for using the Video Codec SDK',
  },
  {
    value: 'display',
    label: 'display',
    description: 'required for leveraging X11 display',
  },
] as const;

export function GpuFieldset({
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
      label: 'Use All GPUs',
    });

    return options;
  }, [gpus, usedGpus, usedAllGpus]);

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
      <TextTip inline={false} color="blue">
        <p>支持目前仅限于 NVIDIA 显卡。</p>
      </TextTip>

      {!enableGpuManagement && (
        <TextTip color="blue">
          该环境的 UI 当前未启用 GPU 功能。
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
            disabled={!enableGpuManagement}
            data-cy="docker-containers-gpu-enabled-switch"
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
              data-cy="docker-containers-gpu-select"
              id="docker-containers-gpu-select"
            />
          </div>
        )}
      </div>

      {values.enabled && (
        <>
          <div className="form-group">
            <div className="col-sm-3 col-lg-2 control-label text-left">
              功能
              <Tooltip message="Portainer 预选了‘compute’和‘utility’功能，因为当你未显式用 docker CLI ‘--gpus’ 参数指定功能时，这些是默认使用的。" />
            </div>
            <div className="col-sm-9 col-lg-10 text-left">
              <Select<GpuOption, true>
                isMulti
                closeMenuOnSelect
                value={capValue}
                options={NvidiaCapabilitiesOptions}
                components={{ Option }}
                onChange={onChangeSelectedCaps}
                data-cy="docker-containers-gpu-capabilities-select"
                id="docker-containers-gpu-capabilities-select"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-3 col-lg-2 control-label text-left">
              控制
              <Tooltip message="这是基于你的设置生成的等效 '--gpus' docker CLI 参数。" />
            </div>
            <div className="col-sm-9 col-lg-10">
              <code>{gpuCmd}</code>
            </div>
          </div>
        </>
      )}
    </div>
  );

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
}

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
