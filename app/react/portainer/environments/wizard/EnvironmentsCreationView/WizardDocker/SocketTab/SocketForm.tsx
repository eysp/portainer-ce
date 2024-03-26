import { Field, Form, Formik, useFormikContext } from 'formik';
import { useReducer } from 'react';
import { Plug2 } from 'lucide-react';

import { useCreateLocalDockerEnvironmentMutation } from '@/react/portainer/environments/queries/useCreateEnvironmentMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import { Environment } from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { InsightsBox } from '@@/InsightsBox';

import { NameField } from '../../shared/NameField';
import { MoreSettingsSection } from '../../shared/MoreSettingsSection';

import { useValidation } from './SocketForm.validation';
import { FormValues } from './types';

interface Props {
  onCreate(environment: Environment): void;
  isDockerStandalone?: boolean;
}

export function SocketForm({ onCreate, isDockerStandalone }: Props) {
  const [formKey, clearForm] = useReducer((state) => state + 1, 0);
  const initialValues: FormValues = {
    name: '',
    socketPath: '',
    overridePath: false,
    meta: { groupId: 1, tagIds: [] },
  };

  const mutation = useCreateLocalDockerEnvironmentMutation();
  const validation = useValidation();

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
            {isDockerStandalone && (
              <InsightsBox
                content={
                  <>
                    <p>
                      从2.18版本开始，Docker Standalone
                      环境的可用GPU设置已经从添加环境和环境详情转移到主机-设置中，
                      以与其他设置保持一致。
                    </p>
                    <p>
                      添加了一个开关，用于在Portainer UI中启用/禁用GPU设置管理，
                      以减轻显示这些设置的性能影响。
                    </p>
                    <p>
                      更新了UI以澄清GPU设置的支持仅适用于Docker Standalone
                      （而不适用于从未在UI中支持的Docker Swarm）。
                    </p>
                  </>
                }
                header="GPU设置更新"
                insightCloseId="gpu-settings-update-closed"
              />
            )}
          </MoreSettingsSection>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button vertical-center"
                loadingText="正在连接环境..."
                isLoading={mutation.isLoading}
                disabled={!dirty || !isValid}
                icon={Plug2}
              >
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
        meta: values.meta,
      },
      {
        onSuccess(environment) {
          notifySuccess('环境创建成功', environment.Name);
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
            label="覆盖默认套接字路径"
            labelClass="col-sm-3 col-lg-2"
          />
        </div>
      </div>
      {values.overridePath && (
        <FormControl
          label="套接字路径"
          tooltip="Docker套接字的路径。请记住要绑定挂载套接字，请查看上面的重要通知获取更多信息。"
          errors={errors.socketPath}
        >
          <Field
            name="socketPath"
            as={Input}
            placeholder="例如： /var/run/docker.sock (在Linux上) or //./pipe/docker_engine (在Windows上)"
          />
        </FormControl>
      )}
    </>
  );
}
