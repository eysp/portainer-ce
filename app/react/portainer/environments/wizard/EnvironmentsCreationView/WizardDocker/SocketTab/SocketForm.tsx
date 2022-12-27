import { Field, Form, Formik, useFormikContext } from 'formik';
import { useReducer } from 'react';

import { useCreateLocalDockerEnvironmentMutation } from '@/portainer/environments/queries/useCreateEnvironmentMutation';
import { Hardware } from '@/react/portainer/environments/wizard/EnvironmentsCreationView/shared/Hardware/Hardware';
import { notifySuccess } from '@/portainer/services/notifications';
import { Environment } from '@/portainer/environments/types';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { Icon } from '@@/Icon';

import { NameField } from '../../shared/NameField';
import { MoreSettingsSection } from '../../shared/MoreSettingsSection';

import { validation } from './SocketForm.validation';
import { FormValues } from './types';

interface Props {
  onCreate(environment: Environment): void;
}

export function SocketForm({ onCreate }: Props) {
  const [formKey, clearForm] = useReducer((state) => state + 1, 0);
  const initialValues: FormValues = {
    name: '',
    socketPath: '',
    overridePath: false,
    meta: { groupId: 1, tagIds: [] },
    gpus: [],
  };

  const mutation = useCreateLocalDockerEnvironmentMutation();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      key={formKey}
    >
      {({ isValid, dirty }) => (
        <Form>
          <NameField />

          <OverrideSocketFieldset />

          <MoreSettingsSection>
            <Hardware />
          </MoreSettingsSection>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button vertical-center"
                loadingText="连接环境..."
                isLoading={mutation.isLoading}
                disabled={!dirty || !isValid}
              >
                <Icon
                  icon="svg-plug"
                  className="icon icon-sm vertical-center"
                />{' '}
                连接
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  function handleSubmit(values: FormValues) {
    mutation.mutate(
      {
        name: values.name,
        socketPath: values.overridePath ? values.socketPath : '',
        gpus: values.gpus,
        meta: values.meta,
      },
      {
        onSuccess(environment) {
          notifySuccess('环境创建', environment.Name);
          clearForm();
          onCreate(environment);
        },
      }
    );
  }
}

function OverrideSocketFieldset() {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.overridePath}
            onChange={(checked) => setFieldValue('overridePath', checked)}
            label="覆盖默认的socket路径"
          />
        </div>
      </div>
      {values.overridePath && (
        <FormControl
          label="Socket 路径"
          tooltip="Docker Socket的路径。记住要对套接字进行绑定挂载，更多信息请参见上面的重要通知。"
          errors={errors.socketPath}
        >
          <Field
            name="socketPath"
            as={Input}
            placeholder="例如 /var/run/docker.sock (on Linux) 或 //./pipe/docker_engine (on Windows)"
          />
        </FormControl>
      )}
    </>
  );
}
