import { useFormikContext } from 'formik';

import { TextTip } from '@@/Tip/TextTip';
import { WebEditorForm } from '@@/WebEditorForm';

import { DeploymentType } from '../../types';

import { FormValues } from './types';

export function ComposeForm({
  handleContentChange,
  hasKubeEndpoint,
  handleVersionChange,
  versionOptions,
}: {
  hasKubeEndpoint: boolean;
  handleContentChange: (type: DeploymentType, content: string) => void;
  handleVersionChange: (newVersion: number) => void;
  versionOptions: number[] | undefined;
}) {
  const { errors, values } = useFormikContext<FormValues>();

  return (
    <>
      {hasKubeEndpoint && (
        <TextTip>
          <p>
            Portainer 不再支持{' '}
            <a
              href="https://docs.docker.com/compose/compose-file/"
              target="_blank"
              rel="noreferrer"
            >
              docker-compose
            </a>{' '}
            格式的 Kubernetes 部署清单，我们也移除了{' '}
            <a href="https://kompose.io/" target="_blank" rel="noreferrer">
              Kompose
            </a>{' '}
            转换工具，该工具曾用于实现此功能。原因是 Kompose 现在存在安全风险，包含多个常见漏洞（CVEs）。
          </p>
          <p>
            尽管 Kompose 项目有维护者，并且属于 CNCF，但其维护不够活跃。发布频率极低，我们提交的新拉取请求也往往数月未合并，同时新的 CVEs 持续出现。
          </p>
          <p>
            我们建议您在沙箱环境中安装自己的 Kompose 实例，将 Docker Compose 文件转换为 Kubernetes 清单，并使用这些清单来设置应用程序。
          </p>
        </TextTip>
      )}

      <WebEditorForm
        data-cy="compose-editor"
        value={values.content}
        type="yaml"
        id="compose-editor"
        placeholder="在此定义或粘贴您的 Docker Compose 文件内容"
        onChange={(value) => handleContentChange(DeploymentType.Compose, value)}
        error={errors.content}
        readonly={hasKubeEndpoint}
        versions={versionOptions}
        onVersionChange={handleVersionChange}
      >
        <div>
          您可以在{' '}
          <a
            href="https://docs.docker.com/compose/compose-file/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>
          中获取有关 Compose 文件格式的更多信息。
        </div>
      </WebEditorForm>
    </>
  );
}
