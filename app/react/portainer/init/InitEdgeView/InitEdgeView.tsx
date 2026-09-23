import { Formik, Form } from 'formik';
import { Laptop, Network } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@uirouter/react';
import { boolean, object, SchemaOf, string } from 'yup';

import {
  validation as urlValidation,
  buildDefaultValue as buildUrlDefaultValue,
  PortainerUrlField,
} from '@/react/portainer/common/PortainerUrlField';
import {
  useSettings,
  useUpdateSettingsMutation,
} from '@/react/portainer/settings/queries/useSettings';
import { EnabledWaitingRoomSwitch } from '@/react/portainer/settings/EdgeComputeView/AutomaticEdgeEnvCreation/EnableWaitingRoomSwitch';
import { ConnectivityTestModal } from '@/react/edge/components/ConnectivityTestModal/ConnectivityTestModal';
import { notifySuccess } from '@/portainer/services/notifications';

import { Switch } from '@@/form-components/SwitchField/Switch';
import { FormControl } from '@@/form-components/FormControl';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

interface FormValues {
  EnableEdgeComputeFeatures: boolean;
  EdgePortainerUrl: string;
  EnableWaitingRoom: boolean;
}

export function InitEdgeView() {
  const router = useRouter();
  const updateSettingsMutation = useUpdateSettingsMutation();
  const settingsQuery = useSettings();
  const [isConnectivityModalOpen, setIsConnectivityModalOpen] = useState(false);

  // Prefill the form from the saved settings when they are set (e.g. from the
  // startup CLI flags), falling back to the browser-derived default otherwise.
  const settings = settingsQuery.data;
  const initialValues: FormValues = {
    EnableEdgeComputeFeatures: settings?.EnableEdgeComputeFeatures ?? false,
    EdgePortainerUrl: settings?.EdgePortainerUrl || buildUrlDefaultValue(),
    EnableWaitingRoom: settings ? !settings.TrustOnFirstConnect : true,
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="container">
        <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          <Widget>
            <WidgetTitle icon={Laptop} title="设置边缘计算 (Edge Compute)" />

            <WidgetBody loading={settingsQuery.isLoading}>
              <p className="text-muted">
                边缘计算使 Portainer 能够管理无法直接访问的环境 —— 例如远程设备、NAT 或防火墙后的环境，或网络连接不稳定的站点。
              </p>
              <ul className="text-muted ml-4 list-disc">
                <li>
                  通过安全的反向隧道接入边缘 Agent，无需在远程端开启任何入站端口。
                </li>
                <li>
                  从单一的 Portainer 实例将堆栈和任务(Jobs)部署到多个边缘环境。
                </li>
              </ul>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnMount
              >
                {({ values, errors, setFieldValue, isValid }) => (
                  <Form className="form-horizontal mt-4" noValidate>
                    <FormControl
                      inputId="edge_enable"
                      label="启用边缘计算功能"
                      size="small"
                      errors={errors.EnableEdgeComputeFeatures}
                    >
                      <Switch
                        id="edge_enable"
                        data-cy="init-edge-enable-switch"
                        name="edge_enable"
                        className="space-right"
                        checked={values.EnableEdgeComputeFeatures}
                        onChange={(e) =>
                          setFieldValue('EnableEdgeComputeFeatures', e)
                        }
                      />
                    </FormControl>

                    {values.EnableEdgeComputeFeatures && (
                      <>
                        <TextTip color="blue" className="mb-2">
                          这是边缘 Agent 用于访问此 Portainer 实例的 URL。它已通过浏览器预填 —— 请确认该地址在您的 Agent 运行环境中是可访问的。稍后您可以在 <b>设置</b> &gt; <b>边缘计算</b> 中修改。
                        </TextTip>

                        <PortainerUrlField
                          fieldName="EdgePortainerUrl"
                          required
                        />

                        <div className="form-group">
                          <div className="col-sm-12">
                            <Button
                              color="default"
                              icon={Network}
                              onClick={() => setIsConnectivityModalOpen(true)}
                              data-cy="init-edge-test-connectivity-button"
                              className="!ml-0"
                            >
                              测试连通性
                            </Button>
                          </div>
                        </div>

                        {isConnectivityModalOpen && (
                          <ConnectivityTestModal
                            portainerUrl={values.EdgePortainerUrl}
                            onDismiss={() => setIsConnectivityModalOpen(false)}
                          />
                        )}

                        <EnabledWaitingRoomSwitch />

                        <TextTip color="blue" className="mb-2">
                          启用后，新的边缘 Agent 需要在 <b>边缘计算</b> &gt; <b>等待室(Waiting Room)</b> 中进行手动批准才能关联。禁用后，Agent 在首次连接时将被自动信任。
                        </TextTip>
                      </>
                    )}

                    <div className="form-group mt-5">
                      <div className="col-sm-12 flex gap-2">
                        <LoadingButton
                          disabled={!isValid}
                          data-cy="init-edge-submit-button"
                          isLoading={updateSettingsMutation.isLoading}
                          loadingText="保存中..."
                        >
                          {values.EnableEdgeComputeFeatures
                            ? '启用并继续'
                            : '继续'}
                        </LoadingButton>

                        <Button
                          type="button"
                          color="light"
                          onClick={goToWizard}
                          data-cy="init-edge-skip-button"
                        >
                          跳过
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </div>
  );

  function goToWizard() {
    router.stateService.go('portainer.wizard');
  }

  function handleSubmit(values: FormValues) {
    if (!values.EnableEdgeComputeFeatures) {
      goToWizard();
      return;
    }

    updateSettingsMutation.mutate(
      {
        EnableEdgeComputeFeatures: true,
        EdgePortainerUrl: values.EdgePortainerUrl,
        TrustOnFirstConnect: !values.EnableWaitingRoom,
      },
      {
        onSuccess() {
          notifySuccess('成功', '边缘计算已启用');
          goToWizard();
        },
      }
    );
  }
}

function validationSchema(): SchemaOf<FormValues> {
  return object({
    EnableEdgeComputeFeatures: boolean().default(false),
    EnableWaitingRoom: boolean().default(true),
    EdgePortainerUrl: string()
      .default('')
      .when('EnableEdgeComputeFeatures', {
        is: true,
        then: () => urlValidation(),
      }),
  });
}
