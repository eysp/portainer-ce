import { useCallback } from 'react';

import { GitFormModel } from '@/react/portainer/gitops/types';
import { PathSelector } from '@/react/portainer/gitops/ComposePathField/PathSelector';
import { dummyGitForm } from '@/react/portainer/gitops/RelativePathFieldset/utils';
import { useValidation } from '@/react/portainer/gitops/RelativePathFieldset/useValidation';
import { useEnableFsPath } from '@/react/portainer/gitops/RelativePathFieldset/useEnableFsPath';

import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { Input, Select } from '@@/form-components/Input';
import { useDocsUrl } from '@@/PageHeader/ContextHelp/ContextHelp';

import { RelativePathModel, getPerDevConfigsFilterType } from './types';

interface Props {
  value: RelativePathModel;
  gitModel?: GitFormModel;
  onChange?: (value: Partial<RelativePathModel>) => void;
  isEditing?: boolean;
  hideEdgeConfigs?: boolean;
}

export function RelativePathFieldset({
  value,
  gitModel,
  onChange,
  isEditing,
  hideEdgeConfigs,
}: Props) {
  const innerOnChange = useCallback(
    (value: Partial<RelativePathModel>) => onChange && onChange(value),
    [onChange]
  );

  const { errors } = useValidation(value);

  const { enableFsPath0, enableFsPath1, toggleFsPath } = useEnableFsPath(value);

  const gitoptsEdgeConfigDocUrl = useDocsUrl(
    '/user/edge/stacks/add#gitops-edge-configurations'
  );

  const pathTip0 =
    '对于使用 Docker Swarm 的相对路径卷，您必须拥有一个所有节点都可以访问的网络文件系统。';
  const pathTip1 =
    '相对路径已激活。当您设置“本地文件系统路径”时，它也会用于 GitOps Edge 配置。';
  const pathTip2 =
    'GitOps Edge 配置已激活。当您设置“本地文件系统路径”时，它也会用于相对路径。';

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            name="EnableRelativePaths"
            label="启用相对路径卷"
            labelClass="col-sm-3 col-lg-2"
            tooltip="启用此选项意味着您可以在 Compose 文件中指定相对路径卷，Portainer 将从您的 Git 仓库中拉取内容到堆栈部署的环境。"
            disabled={isEditing}
            checked={value.SupportRelativePath}
            onChange={(value) => {
              toggleFsPath(0, value);
              innerOnChange({ SupportRelativePath: value });
            }}
          />
        </div>
      </div>

      {value.SupportRelativePath && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                {enableFsPath1 ? pathTip2 : pathTip0}
              </TextTip>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <FormControl
                label="本地文件系统路径"
                errors={errors.FilesystemPath}
              >
                <Input
                  name="FilesystemPath"
                  placeholder="/mnt"
                  disabled={isEditing || !enableFsPath0}
                  value={value.FilesystemPath}
                  onChange={(e) =>
                    innerOnChange({ FilesystemPath: e.target.value })
                  }
                />
              </FormControl>
            </div>
          </div>
        </>
      )}

      {!hideEdgeConfigs && (
        <>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                启用后，相应的 Edge ID 将作为环境变量传递：PORTAINER_EDGE_ID。
              </TextTip>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                name="EnablePerDeviceConfigs"
                label="GitOps Edge 配置"
                labelClass="col-sm-3 col-lg-2"
                tooltip="通过启用 GitOps Edge 配置功能，您可以在配置文件中定义相对路径卷。Portainer 会自动从您的 Git 仓库中获取内容，将文件夹名称或文件名称与 Portainer Edge ID 匹配，并将其应用到堆栈部署的环境中。"
                disabled={isEditing}
                checked={!!value.SupportPerDeviceConfigs}
                onChange={(value) => {
                  toggleFsPath(1, value);
                  innerOnChange({ SupportPerDeviceConfigs: value });
                }}
              />
            </div>
          </div>

          {value.SupportPerDeviceConfigs && (
            <>
              {!isEditing && (
                <div className="form-group">
                  <div className="col-sm-12">
                    <TextTip color="blue">
                      {enableFsPath0 ? pathTip1 : pathTip0}
                    </TextTip>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="form-group">
                  <div className="col-sm-12">
                    <FormControl
                      label="本地文件系统路径"
                      errors={errors.FilesystemPath}
                    >
                      <Input
                        name="FilesystemPath"
                        placeholder="/mnt"
                        disabled={isEditing || !enableFsPath1}
                        value={value.FilesystemPath}
                        onChange={(e) =>
                          innerOnChange({ FilesystemPath: e.target.value })
                        }
                      />
                    </FormControl>
                  </div>
                </div>
              )}

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    指定配置所在的目录名称。这将允许您使用 Git 仓库作为模板来管理设备配置设置。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl
                    label="目录"
                    errors={errors.PerDeviceConfigsPath}
                    inputId="per_device_configs_path_input"
                  >
                    <PathSelector
                      value={value.PerDeviceConfigsPath || ''}
                      onChange={(value) =>
                        innerOnChange({ PerDeviceConfigsPath: value })
                      }
                      placeholder="config"
                      model={gitModel || dummyGitForm}
                      readOnly={isEditing}
                      dirOnly
                      inputId="per_device_configs_path_input"
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    选择用于匹配配置与 Portainer Edge ID 的规则，可以是按设备匹配，也可以是整个 Edge 组匹配。只有符合所选规则的配置才能通过其对应路径访问。依赖于访问配置的部署可能会遇到错误。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="Device matching rule">
                    <Select
                      value={value.PerDeviceConfigsMatchType}
                      onChange={(e) =>
                        innerOnChange({
                          PerDeviceConfigsMatchType: getPerDevConfigsFilterType(
                            e.target.value
                          ),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '文件名与 Portainer Edge ID 匹配',
                          value: 'file',
                        },
                        {
                          label: '文件夹名与 Portainer Edge ID 匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <FormControl label="Group matching rule">
                    <Select
                      value={value.PerDeviceConfigsGroupMatchType}
                      onChange={(e) =>
                        innerOnChange({
                          PerDeviceConfigsGroupMatchType:
                            getPerDevConfigsFilterType(e.target.value),
                        })
                      }
                      options={[
                        {
                          label: '',
                          value: '',
                        },
                        {
                          label: '文件名与 Edge 组匹配p',
                          value: 'file',
                        },
                        {
                          label: '文件夹名与 Edge 组匹配',
                          value: 'dir',
                        },
                      ]}
                      disabled={isEditing}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    <div>
                      您可以将其作为环境变量与镜像一起使用：{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_ID&#125;</code> 或{' '}
                      <code>myapp:$&#123;PORTAINER_EDGE_GROUP&#125;</code>。您
                      也可以将其与卷的相对路径一起使用：{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_ID&#125;:/myapp/config
                      </code>{' '}
                      或{' '}
                      <code>
                        ./config/$&#123;PORTAINER_EDGE_GROUP&#125;:/myapp/groupconfig
                      </code>
                      。更多文档可以在{' '}
                      <a href={gitoptsEdgeConfigDocUrl}>这里</a>找到。
                    </div>
                  </TextTip>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
