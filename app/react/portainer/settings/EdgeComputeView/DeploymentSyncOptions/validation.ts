import { boolean, number, object, SchemaOf } from 'yup';

import { options as asyncIntervalOptions } from '@/react/edge/components/EdgeAsyncIntervalsForm';

import { FormValues } from './types';

const intervals = asyncIntervalOptions.map((option) => option.value);

export function validationSchema(): SchemaOf<FormValues> {
  return object({
    EdgeAgentCheckinInterval: number().required('此字段为必填项。'),
    Edge: object({
      PingInterval: number()
        .required('此字段为必填项。')
        .oneOf(intervals),
      SnapshotInterval: number()
        .required('此字段为必填项。')
        .oneOf(intervals),
      CommandInterval: number()
        .required('此字段为必填项。')
        .oneOf(intervals),
      AsyncMode: boolean().default(false),
    }),
  });
}
