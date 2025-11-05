import { SchemaOf, TestContext, number, object } from 'yup';

import KubernetesResourceReservationHelper from '@/kubernetes/helpers/resourceReservationHelper';
import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { ResourceQuotaFormValues } from './types';

type NodeLimit = {
  CPU: number;
  Memory: number;
};

type NodesLimits = Record<string, NodeLimit>;

type ValidationData = {
  maxMemoryLimit: number;
  maxCpuLimit: number;
  isEnvironmentAdmin: boolean;
  nodeLimits: NodesLimits;
  isExistingCPUReservationUnchanged: boolean;
  isExistingMemoryReservationUnchanged: boolean;
};

export function resourceReservationValidation(
  validationData?: ValidationData
): SchemaOf<ResourceQuotaFormValues> {
  return object().shape({
    memoryLimit: nanNumberSchema('内存限制是必填项。')
      .min(0, '值必须大于或等于 0。')
      .test(
        'exhaused',
        `此命名空间的内存容量已耗尽，因此无法部署应用程序。${
          validationData?.isEnvironmentAdmin
            ? ''
            : ' 请联系您的管理员扩展命名空间的内存容量。'
        }`,
        () => !!validationData && validationData.maxMemoryLimit > 0
      )
      .max(validationData?.maxMemoryLimit || 0, ({ value }) =>
        // when the existing reservation is unchanged and exceeds the new limit, show a different error message
        // https://portainer.atlassian.net/browse/EE-5933?focusedCommentId=29308
        validationData?.isExistingMemoryReservationUnchanged
          ? `值必须在 0 到 ${validationData?.maxMemoryLimit}MB 之间 - 之前的值为 ${value}，超过了此限制。`
          : `值必须在 0 到 ${validationData?.maxMemoryLimit}MB 之间。`
      )
      .test(
        'hasSuitableNode',
        `这些预留将超过集群中当前可用的资源。`,
        (value: number | undefined, context: TestContext) => {
          if (!validationData || value === undefined) {
            // explicitely check for undefined, since 0 is a valid value
            return true;
          }
          const { memoryLimit, cpuLimit } = context.parent;
          return hasSuitableNode(
            memoryLimit,
            cpuLimit,
            validationData.nodeLimits
          );
        }
      )
      .required('内存限制是必填项。'),
    cpuLimit: number()
      .min(0)
      .test(
        'exhaused',
        `此命名空间的 CPU 容量已耗尽，因此无法部署应用程序。${
          validationData?.isEnvironmentAdmin
            ? ''
            : ' 请联系您的管理员扩展命名空间的 CPU 容量。'
        }`,
        () => !!validationData && validationData.maxCpuLimit > 0
      )
      .max(validationData?.maxCpuLimit || 0, ({ value }) =>
        // when the existing reservation is unchanged and exceeds the new limit, show a different error message
        // https://portainer.atlassian.net/browse/EE-5933?focusedCommentId=29308
        validationData?.isExistingCPUReservationUnchanged
          ? `值必须在 0 到 ${validationData?.maxCpuLimit} 之间 - 之前的值为 ${value}，超过了此限制。`
          : `值必须在 0 到 ${validationData?.maxCpuLimit} 之间。`
      )
      .test(
        'hasSuitableNode',
        `这些预留将超过集群中当前可用的资源。`,
        (value: number | undefined, context: TestContext) => {
          if (!validationData || value === undefined) {
            // explicitely check for undefined, since 0 is a valid value
            return true;
          }
          const { memoryLimit, cpuLimit } = context.parent;
          return hasSuitableNode(
            memoryLimit,
            cpuLimit,
            validationData.nodeLimits
          );
        }
      )
      .required(),
  });
}

function hasSuitableNode(
  memoryLimit: number,
  cpuLimit: number,
  nodeLimits: NodesLimits
) {
  const nanParsedMemoryLimit = Number.isNaN(memoryLimit) ? 0 : memoryLimit;
  const nanParsedCPULimit = Number.isNaN(cpuLimit) ? 0 : cpuLimit;
  // transform the nodelimits from bytes to MB
  const limits = Object.values(nodeLimits).map((nodeLimit) => ({
    ...nodeLimit,
    Memory: KubernetesResourceReservationHelper.megaBytesValue(
      nodeLimit.Memory
    ),
  }));
  // make sure there's a node available with enough memory and cpu
  return limits.some(
    (nodeLimit) =>
      nodeLimit.Memory >= nanParsedMemoryLimit &&
      nodeLimit.CPU >= nanParsedCPULimit
  );
}
