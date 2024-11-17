import { array, object, SchemaOf, string, number } from 'yup';

import { parseIsoDate } from '@/portainer/filters/filters';
import { EdgeGroup } from '@/react/edge/edge-groups/types';

import { EdgeUpdateSchedule, ScheduleType } from '../types';

import { nameValidation } from './NameField';
import { typeValidation } from './ScheduleTypeSelector';
import { FormValues } from './types';

export function validation(
  schedules: EdgeUpdateSchedule[],
  edgeGroups: Array<EdgeGroup> | undefined,
  currentId?: EdgeUpdateSchedule['id']
): SchemaOf<FormValues> {
  return object({
    groupIds: array()
      .of(number().default(0))
      .min(1, '至少需要一个组')
      .test(
        '至少一个组必须包含终端',
        (groupIds) =>
          !!(
            groupIds &&
            edgeGroups &&
            groupIds?.flatMap(
              (id) => edgeGroups?.find((group) => group.Id === id)?.Endpoints
            ).length > 0
          )
      ),
    name: nameValidation(schedules, currentId),
    type: typeValidation(),
    scheduledTime: string()
      .default('')
      .test('valid', (value) => !value || parseIsoDate(value) !== null),
    version: string()
      .default('')
      .when('type', {
        is: ScheduleType.Update,
        // update type
        then: (schema) => schema.required('版本为必填项'),
        // rollback
        otherwise: (schema) => schema.required('没有可用的回滚选项'),
      }),
    registryId: number().default(0),
  });
}
