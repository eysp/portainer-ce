import { Field, Form, Formik } from 'formik';
import { useReducer } from 'react';
import { Plug2 } from 'lucide-react';

import { useCreateRemoteEnvironmentMutation } from '@/react/portainer/environments/queries/useCreateEnvironmentMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import {
  Environment,
  EnvironmentCreationTypes,
} from '@/react/portainer/environments/types';
import { TLSFieldset } from '@/react/components/TLSFieldset/TLSFieldset';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { InsightsBox } from '@@/InsightsBox';

import { NameField } from '../../shared/NameField';
import { MoreSettingsSection } from '../../shared/MoreSettingsSection';

import { useValidation } from './APIForm.validation';
import { FormValues } from './types';

interface Props {
  onCreate(environment: Environment): void;
  isDockerStandalone?: boolean;
}

export function APIForm({ onCreate, isDockerStandalone }: Props) {
  const [formKey, clearForm] = useReducer((state) => state + 1, 0);
  const initialValues: FormValues = {
    url: '',
    name: '',
    tlsConfig: {
      tls: false,
      skipVerify: false,
    },
    meta: {
      groupId: 1,
      tagIds: [],
    },
  };

  const mutation = useCreateRemoteEnvironmentMutation(
    EnvironmentCreationTypes.LocalDockerEnvironment
  );

  const validation = useValidation();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      key={formKey}
    >
      {({ values, errors, setFieldValue, isValid, dirty }) => (
        <Form>
          <NameField />

          <FormControl
            inputId="url-field"
            label="Docker API URL"
            required
            tooltip="Docker主机的URL或IP地址。Docker API必须通过TCP端口公开。请参阅Docker文档进行配置。"
          >
            <Field
              as={Input}
              id="url-field"
              name="url"
              placeholder="例如：10.0.0.10:2375 或 mydocker.mydomain.com:2375"
            />
          </FormControl>

          <TLSFieldset
            values={values.tlsConfig}
            onChange={(value) =>
              Object.entries(value).forEach(([key, value]) =>
                setFieldValue(`tlsConfig.${key}`, value)
              )
            }
            errors={errors.tlsConfig}
          />

          <MoreSettingsSection>
            {isDockerStandalone && (
              <InsightsBox
                content={
                  <>
                    <p>
                      从2.18版本开始，Docker独立环境中可用的GPU设置已从
                      “添加环境”和“环境详细信息”转移到“主机 -&gt; 设置”，以与其他设置对齐。
                    </p>
                    <p>
                      在Portainer UI中引入了一个开关，用于启用/禁用GPU设置的管理，
                      以减轻显示这些设置的性能影响。
                    </p>
                    <p>
                      UI已更新以澄清GPU设置仅适用于Docker独立环境
                      （而不适用于从未在UI中支持的Docker Swarm）。
                    </p>
                  </>
                }
                header="GPU settings update"
                insightCloseId="gpu-settings-update-closed"
              />
            )}
          </MoreSettingsSection>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button vertical-center"
                loadingText="连接环境中..."
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
    const tls = getTlsValues();

    mutation.mutate(
      {
        name: values.name,
        url: values.url,
        options: {
          tls,
          meta: values.meta,
        },
      },
      {
        onSuccess(environment) {
          notifySuccess('环境创建成功', environment.Name);
          clearForm();
          onCreate(environment);
        },
      }
    );
    function getTlsValues() {
      if (!values.tlsConfig.tls) {
        return undefined;
      }

      return {
        skipVerify: values.tlsConfig.skipVerify,
        ...getCertFiles(),
      };

      function getCertFiles() {
        if (values.tlsConfig.skipVerify) {
          return {};
        }

        return {
          caCertFile: values.tlsConfig.caCertFile,
          certFile: values.tlsConfig.certFile,
          keyFile: values.tlsConfig.keyFile,
        };
      }
    }
  }
}
