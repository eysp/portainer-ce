import { SchemaOf, array, boolean, mixed, object, string } from 'yup';

import { PlacementsFormValues } from './types';

export function placementsValidation(): SchemaOf<PlacementsFormValues> {
  return object({
    placementType: mixed().oneOf(['mandatory', 'preferred']).required(),
    placements: array(
      object({
        label: string().required('节点标签是必填项。'),
        value: string().required('节点值是必填项。'),
        needsDeletion: boolean(),
      }).required()
    ),
  });
}
