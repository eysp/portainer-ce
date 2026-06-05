import { FormikErrors } from 'formik';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { SliderWithInput } from '@@/form-components/Slider/SliderWithInput';
import { FormControl } from '@@/form-components/FormControl';
import { FormError } from '@@/form-components/FormError';
import { Slider } from '@@/form-components/Slider';

import { ResourceQuotaFormValues } from './types';

type Props = {
  values: ResourceQuotaFormValues;
  onChange: (values: ResourceQuotaFormValues) => void;
  errors: FormikErrors<ResourceQuotaFormValues>;
  namespaceHasQuota: boolean;
  resourceQuotaCapacityExceeded: boolean;
  minMemoryLimit: number;
  minCpuLimit: number;
  maxMemoryLimit: number;
  maxCpuLimit: number;
};

export function ResourceReservationFormSection({
  values,
  onChange,
  errors,
  namespaceHasQuota,
  resourceQuotaCapacityExceeded,
  minMemoryLimit,
  minCpuLimit,
  maxMemoryLimit,
  maxCpuLimit,
}: Props) {
  return (
    <FormSection title="资源预留" titleSize="md">
      {!namespaceHasQuota && (
        <TextTip color="blue">
          资源预留应用于应用程序的每个实例。
        </TextTip>
      )}
      {namespaceHasQuota && !resourceQuotaCapacityExceeded && (
        <TextTip color="blue">
          此命名空间设置了资源配额，您必须指定资源预留。资源预留应用于应用程序的每个实例。最大值继承自命名空间配额。
        </TextTip>
      )}
      <FormControl
        className="flex flex-row"
        label="内存限制（MB）"
        tooltip="此应用程序的实例将保留此数量的内存。如果实例内存使用量超过预留值，可能会受到 OOM 影响。"
      >
        <div className="col-xs-10">
          {maxMemoryLimit > 0 && (
            <SliderWithInput
              value={Number(values.memoryLimit) ?? 0}
              onChange={(value) => onChange({ ...values, memoryLimit: value })}
              min={minMemoryLimit}
              max={maxMemoryLimit}
              step={128}
              dataCy="k8sAppCreate-memoryLimit"
              visibleTooltip
            />
          )}
          {errors?.memoryLimit && (
            <FormError className="pt-1">{errors.memoryLimit}</FormError>
          )}
        </div>
      </FormControl>
      <FormControl
        className="flex flex-row"
        label="CPU 限制"
        tooltip="此应用程序的实例将保留此数量的 CPU。如果实例 CPU 使用量超过预留值，可能会受到 CPU 限制。"
      >
        <div className="col-xs-10">
          {maxCpuLimit > 0 && (
            <Slider
              onChange={(value) =>
                onChange(
                  typeof value === 'number'
                    ? { ...values, cpuLimit: value }
                    : { ...values, cpuLimit: value[0] ?? 0 }
                )
              }
              value={values.cpuLimit}
              min={minCpuLimit}
              max={maxCpuLimit}
              step={0.1}
              dataCy="k8sAppCreate-cpuLimitSlider"
              visibleTooltip
            />
          )}
          {errors?.cpuLimit && (
            <FormError className="pt-1">{errors.cpuLimit}</FormError>
          )}
        </div>
      </FormControl>
    </FormSection>
  );
}
