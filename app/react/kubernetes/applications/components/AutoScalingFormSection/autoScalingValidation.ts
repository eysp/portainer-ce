import { SchemaOf, boolean, number, object } from 'yup';

import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { AutoScalingFormValues } from './types';

type ValidationData = {
  autoScalerOverflow: boolean;
};

export function autoScalingValidation(
  validationData?: ValidationData
): SchemaOf<AutoScalingFormValues> {
  const { autoScalerOverflow } = validationData || {};
  return object({
    isUsed: boolean().required(),
    minReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema('最小实例数是必填项。')
            .required('最小实例数是必填项。')
            .min(1, 'Minimum instances must be greater than 0.')
            .test(
              'maxReplicas',
              'Minimum instances must be less than maximum instances.',
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return true;
                }
                const { maxReplicas } = this.parent as AutoScalingFormValues;
                return !maxReplicas || value < maxReplicas;
              }
            )
        : number()
    ),
    maxReplicas: number().when('isUsed', (isUsed: boolean) =>
      isUsed
        ? nanNumberSchema('最大实例数是必填项。')
            .required('最大实例数是必填项。')
            .test(
              'minReplicas',
              'Maximum instances must be greater than minimum instances.',
              // eslint-disable-next-line func-names
              function (this, value?: number): boolean {
                if (!value) {
                  return false;
                }
                const { minReplicas } = this.parent as AutoScalingFormValues;
                return !minReplicas || value > minReplicas;
              }
            )
            .test(
              'overflow',
              'This application would exceed available resources. Please reduce the maximum instances or the resource reservations.',
              () => !autoScalerOverflow
            )
        : number()
    ),
    targetCpuUtilizationPercentage: number().when(
      'isUsed',
      (isUsed: boolean) =>
        isUsed
          ? nanNumberSchema('目标 CPU 利用率百分比是必填项。')
              .min(0, 'Target CPU usage must be greater than 0.')
              .max(100, 'Target CPU usage must be smaller than 100.')
              .required('目标 CPU 利用率百分比是必填项。')
          : number()
    ),
  });
}
