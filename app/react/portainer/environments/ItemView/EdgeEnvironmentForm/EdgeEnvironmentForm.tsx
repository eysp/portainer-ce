import { Form, Formik, useFormikContext } from 'formik';
import _ from 'lodash';

import { NameField } from '@/react/portainer/environments/common/NameField/NameField';
import { PublicUrlField } from '@/react/portainer/environments/common/PublicUrlField/PublicUrlField';
import { EdgeIntervalsFieldset } from '@/react/portainer/environments/common/EdgeIntervalsFieldset/EdgeIntervalsFieldset';
import { useUpdateEnvironmentMutation } from '@/react/portainer/environments/queries/useUpdateEnvironmentMutation';
import { Environment } from '@/react/portainer/environments/types';

import { Widget } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';
import { FormSection } from '@@/form-components/FormSection';

import { MetadataFieldset } from '../../common/MetadataFieldset';
import { EnvironmentFormActions } from '../EnvironmentFormActions/EnvironmentFormActions';

import { EdgeEnvironmentFormValues } from './types';
import { buildInitialValues, buildUpdatePayload } from './helpers';
import { useEdgeValidation } from './validation';

interface Props {
  environment: Environment;
  onSuccess: () => void;
}

export function EdgeEnvironmentForm({ environment, onSuccess }: Props) {
  const initialValues = buildInitialValues(environment);
  const validationSchema = useEdgeValidation(environment.Id);
  const updateMutation = useUpdateEnvironmentMutation();

  async function handleSubmit(values: EdgeEnvironmentFormValues) {
    if (_.difference(environment.TagIds, values.meta.tagIds || []).length > 0) {
      const confirmed = await confirmDestructive({
        title: '确认操作',
        message:
          '从此环境中移除标签可能会导致在使用动态分组时移除对应的边缘栈',
        confirmButton: buildConfirmButton(),
      });

      if (!confirmed) {
        return;
      }
    }

    const payload = buildUpdatePayload(values, environment);
    updateMutation.mutate({ id: environment.Id, payload }, { onSuccess });
  }

  return (
    <Widget>
      <Widget.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnMount
          enableReinitialize
        >
          <EdgeEnvironmentFormContent
            environment={environment}
            isSubmitting={updateMutation.isLoading}
          />
        </Formik>
      </Widget.Body>
    </Widget>
  );
}

interface FormContentProps {
  environment: Environment;
  isSubmitting: boolean;
}

function EdgeEnvironmentFormContent({
  environment,
  isSubmitting,
}: FormContentProps) {
  const { isValid, dirty, values, setValues } =
    useFormikContext<EdgeEnvironmentFormValues>();

  const asyncMode = environment.Edge?.AsyncMode || false;

  return (
    <Form className="form-horizontal">
      <FormSection title="配置">
        <NameField />
        <PublicUrlField />
        <TextTip color="blue">
          在边缘 Agent 上使用 HTTPS 连接以支持带有认证凭据的私有镜像仓库。
        </TextTip>
      </FormSection>

      <EdgeIntervalsFieldset
        value={values.edge}
        onChange={(intervalValues) => {
          setValues((values) => ({
            ...values,
            edge: {
              ...values.edge,
              ...intervalValues,
            },
          }));
        }}
        asyncMode={asyncMode}
      />

      <MetadataFieldset />

      <EnvironmentFormActions
        isLoading={isSubmitting}
        isValid={isValid}
        isDirty={dirty}
      />
    </Form>
  );
}
