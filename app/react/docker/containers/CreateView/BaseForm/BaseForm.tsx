import { useFormikContext } from 'formik';

import { useCurrentEnvironment } from '@/react/hooks/useCurrentEnvironment';
import { Authorized } from '@/react/hooks/useUser';
import { AccessControlForm } from '@/react/portainer/access-control';
import { AccessControlFormData } from '@/react/portainer/access-control/types';
import { EnvironmentType } from '@/react/portainer/environments/types';
import { NodeSelector } from '@/react/docker/agent/NodeSelector';
import { useIsSwarm } from '@/react/docker/proxy/queries/useInfo';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { isAgentEnvironment } from '@/react/portainer/environments/utils';
import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { ImageConfigFieldset, ImageConfigValues } from '@@/ImageConfigFieldset';
import { LoadingButton } from '@@/buttons';
import { Widget } from '@@/Widget';

import {
  PortsMappingField,
  Values as PortMappingValue,
} from './PortsMappingField';

export interface Values {
  name: string;
  enableWebhook: boolean;
  publishAllPorts: boolean;
  image: ImageConfigValues;
  alwaysPull: boolean;
  ports: PortMappingValue;
  accessControl: AccessControlFormData;
  nodeName: string;
  autoRemove: boolean;
}

function useIsAgentOnSwarm() {
  const environmentId = useEnvironmentId();
  const environmentQuery = useCurrentEnvironment();

  const isSwarm = useIsSwarm(environmentId);

  return (
    !!environmentQuery.data &&
    isAgentEnvironment(environmentQuery.data?.Type) &&
    isSwarm
  );
}

export function BaseForm({
  isLoading,
  onChangeName,
  onChangeImageName,
  onRateLimit,
}: {
  isLoading: boolean;
  onChangeName: (value: string) => void;
  onChangeImageName: () => void;
  onRateLimit: (limited?: boolean) => void;
}) {
  const { setFieldValue, values, errors, isValid } = useFormikContext<Values>();
  const environmentQuery = useCurrentEnvironment();
  const isAgentOnSwarm = useIsAgentOnSwarm();
  if (!environmentQuery.data) {
    return null;
  }

  const environment = environmentQuery.data;

  const canUseWebhook = environment.Type !== EnvironmentType.EdgeAgentOnDocker;

  return (
    <Widget>
      <Widget.Body>
        <FormControl label="名称" inputId="name-input" errors={errors?.name}>
          <Input
            id="name-input"
            value={values.name}
            onChange={(e) => {
              const name = e.target.value;
              onChangeName(name);
              setFieldValue('name', name);
            }}
            placeholder="例如 myContainer"
          />
        </FormControl>

        <FormSection title="镜像配置">
          <ImageConfigFieldset
            values={values.image}
            setFieldValue={(field, value) =>
              setFieldValue(`image.${field}`, value)
            }
            autoComplete
            onRateLimit={values.alwaysPull ? onRateLimit : undefined}
            errors={errors?.image}
            onChangeImage={onChangeImageName}
          >
            <div className="form-group">
              <div className="col-sm-12">
                <SwitchField
                  label="始终拉取镜像"
                  tooltip="启用时，Portainer将在创建容器之前自动尝试拉取指定的镜像。r."
                  checked={values.alwaysPull}
                  onChange={(alwaysPull) =>
                    setFieldValue('alwaysPull', alwaysPull)
                  }
                  labelClass="col-sm-3 col-lg-2"
                />
              </div>
            </div>
          </ImageConfigFieldset>
        </FormSection>

        {canUseWebhook && (
          <Authorized authorizations="PortainerWebhookCreate" adminOnlyCE>
            <FormSection title="Webhook">
              <div className="form-group">
                <div className="col-sm-12">
                  <SwitchField
                    label="创建容器 Webhook"
                    tooltip="创建一个 webhook（或回调 URI），以自动化重新创建此容器。向此回调 URI 发送 POST 请求（无需任何身份验证）将拉取与之关联的最新版本镜像，并重新创建此容器。."
                    checked={values.enableWebhook}
                    onChange={(enableWebhook) =>
                      setFieldValue('enableWebhook', enableWebhook)
                    }
                    featureId={FeatureId.CONTAINER_WEBHOOK}
                    labelClass="col-sm-3 col-lg-2"
                  />
                </div>
              </div>
            </FormSection>
          </Authorized>
        )}

        <FormSection title="网络端口配置">
          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                label="将所有暴露的端口发布到随机的主机端"
                tooltip="启用时，Portainer 将允许 Docker 自动将主机上的随机端口映射到镜像 Dockerfile 中定义的每个端口。."
                checked={values.publishAllPorts}
                onChange={(publishAllPorts) =>
                  setFieldValue('publishAllPorts', publishAllPorts)
                }
                labelClass="col-sm-3 col-lg-2"
              />
            </div>
          </div>

          <PortsMappingField
            value={values.ports}
            onChange={(ports) => setFieldValue('ports', ports)}
            errors={errors?.ports}
          />
        </FormSection>

        {isAgentOnSwarm && (
          <FormSection title="部署">
            <NodeSelector
              value={values.nodeName}
              onChange={(nodeName) => setFieldValue('nodeName', nodeName)}
            />
          </FormSection>
        )}

        <AccessControlForm
          onChange={(accessControl) =>
            setFieldValue('accessControl', accessControl)
          }
          errors={errors?.accessControl}
          values={values.accessControl}
          environmentId={environment.Id}
        />

        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              label="自动删除"
              tooltip="启用时，Portainer将在容器退出时自动删除容器。这在您只想使用容器一次时很有用。"
              checked={values.autoRemove}
              onChange={(autoRemove) => setFieldValue('autoRemove', autoRemove)}
              labelClass="col-sm-3 col-lg-2"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-12">
            <LoadingButton
              loadingText="部署中..."
              isLoading={isLoading}
              disabled={!isValid}
            >
              部署容器
            </LoadingButton>
          </div>
        </div>
      </Widget.Body>
    </Widget>
  );
}
