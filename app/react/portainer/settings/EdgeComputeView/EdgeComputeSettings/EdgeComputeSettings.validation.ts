import { boolean, number, object } from 'yup';

export function validationSchema() {
  return object().shape({
    EdgeAgentCheckinInterval: number().required('此字段必填。'),
    EnableEdgeComputeFeatures: boolean().required('此字段必填。'),
    EnforceEdgeID: boolean().required('此字段必填。'),
  });
}
