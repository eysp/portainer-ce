import { Field, FormikErrors } from 'formik';
import { string } from 'yup';
import { useMemo } from 'react';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { useEdgeJobs } from '../../queries/useEdgeJobs';
import { EdgeJob } from '../../types';

export function NameField({ errors }: { errors?: FormikErrors<string> }) {
  return (
    <FormControl label="名称" required errors={errors} inputId="edgejob_name">
      <Field
        as={Input}
        name="name"
        placeholder="例如 backup-app-prod"
        data-cy="edgejob-name-input"
        id="edgejob_name"
      />
    </FormControl>
  );
}

export function useNameValidation(id?: EdgeJob['Id']) {
  const edgeJobsQuery = useEdgeJobs();

  return useMemo(
    () =>
      string()
        .required('名称为必填项')
        .matches(
          /^[a-zA-Z0-9][a-zA-Z0-9_.-]+$/,
          'Allowed characters are: [a-zA-Z0-9_.-]'
        )
        .test({
          name: 'is-unique',
          test: (value) =>
            !edgeJobsQuery.data?.find(
              (job) => job.Name === value && job.Id !== id
            ),
          message: 'Name must be unique',
        }),
    [edgeJobsQuery.data, id]
  );
}
