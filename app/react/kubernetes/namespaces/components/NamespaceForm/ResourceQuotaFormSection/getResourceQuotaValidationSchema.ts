import { boolean, string, object, SchemaOf, TestContext } from 'yup';

import { ResourceQuotaFormValues } from './types';

export function getResourceQuotaValidationSchema(
  memoryLimit: number,
  cpuLimit: number
): SchemaOf<ResourceQuotaFormValues> {
  return object({
    enabled: boolean().required('资源配额启用状态是必填项。'),
    memory: string()
      .test(
        'non-negative-memory-validation',
        '现有命名空间的内存限制已超过集群中可用的资源。在您设置此处的值之前，必须减少命名空间中的数量（您可能需要临时启用过度提交才能这样做）。',
        () => nonNegativeLimit(memoryLimit)
      )
      .test(
        'memory-validation',
        `值必须在 0 到 ${memoryLimit} 之间。`,
        memoryValidation
      ),
    cpu: string()
      .test(
        'non-negative-memory-validation',
        '现有命名空间的 CPU 限制已超过集群中可用的资源。在您设置此处的值之前，必须减少命名空间中的数量（您可能需要临时启用过度提交才能这样做）。',
        () => nonNegativeLimit(cpuLimit)
      )
      .test('cpu-validation', 'CPU 限制值是必填项。', cpuValidation),
  }).test(
    'resource-quota-validation',
    '至少必须设置一个限制。',
    oneLimitSet
  );

  function oneLimitSet({
    enabled,
    memory,
    cpu,
  }: Partial<ResourceQuotaFormValues>) {
    return !enabled || (Number(memory) ?? 0) > 0 || (Number(cpu) ?? 0) > 0;
  }

  function nonNegativeLimit(limit: number) {
    return limit >= 0;
  }

  function memoryValidation(this: TestContext, memoryValue?: string) {
    const memory = Number(memoryValue) ?? 0;
    const { enabled } = this.parent;
    return !enabled || (memory >= 0 && memory <= memoryLimit);
  }

  function cpuValidation(this: TestContext, cpuValue?: string) {
    const cpu = Number(cpuValue) ?? 0;
    const { enabled } = this.parent;
    return !enabled || cpu >= 0;
  }
}
