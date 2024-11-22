import { ComponentProps } from 'react';

import { Alert } from '@@/Alert';
import { useDocsUrl } from '@@/PageHeader/ContextHelp/ContextHelp';

import { EnvironmentVariablesFieldset } from './EnvironmentVariablesFieldset';
import { EnvironmentVariablesPanel } from './EnvironmentVariablesPanel';

type FieldsetProps = ComponentProps<typeof EnvironmentVariablesFieldset>;

export function StackEnvironmentVariablesPanel({
  onChange,
  values,
  errors,
  isFoldable = false,
  showHelpMessage,
}: {
  isFoldable?: boolean;
  showHelpMessage?: boolean;
} & FieldsetProps) {
  return (
    <EnvironmentVariablesPanel
      explanation={
        <div>
          您可以在 Compose 文件中使用{' '}
          <a
            href={`${useDocsUrl(
              '/user/docker/stacks/add#environment-variables'
            )}`}
            target="_blank"
            data-cy="stack-env-vars-help-link"
            rel="noreferrer noopener"
          >
            环境变量
          </a>
          。下面设置的环境变量值将用作 Compose 文件中的
          替换值。请注意，您还可以在 Compose 文件中引用
          stack.env 文件。stack.env 文件包含
          环境变量及其值（例如 TAG=v1.5）。
        </div>
      }
      onChange={onChange}
      values={values}
      errors={errors}
      isFoldable={isFoldable}
      showHelpMessage={showHelpMessage}
      alertMessage={
        <div className="flex p-4">
          <Alert color="info" className="col-sm-12">
            <div>
              <p>
                <strong>stack.env 文件操作</strong>
              </p>
              <div>
                通过 <strong>代码仓库</strong> 部署时，stack.env
                文件必须已驻留在 Git 存储库中。
              </div>
              <div>
                通过 <strong>网页编辑器</strong>,{' '}
                <strong>上传</strong> 或{' '}
                <strong>自定义模板</strong> 部署时，stack.env 文件
                会根据您在下面设置的内容自动创建。
              </div>
            </div>
          </Alert>
        </div>
      }
    />
  );
}
