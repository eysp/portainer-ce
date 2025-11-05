import { useDockerComposeSchema } from '@/react/hooks/useDockerComposeSchema/useDockerComposeSchema';

import { InlineLoader } from '@@/InlineLoader';
import { WebEditorForm } from '@@/WebEditorForm';

export function DockerContentField({
  error,
  onChange,
  readonly,
  value,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  readonly?: boolean;
  isLoading?: boolean;
}) {
  const dockerComposeSchemaQuery = useDockerComposeSchema();

  if (isLoading || dockerComposeSchemaQuery.isInitialLoading) {
    return <InlineLoader>正在加载堆栈内容...</InlineLoader>;
  }

  return (
    <WebEditorForm
      id="stack-creation-editor"
      value={value}
      onChange={onChange}
      type="yaml"
      textTip="在此定义或粘贴您的 Docker Compose 文件内容"
      error={error}
      readonly={readonly}
      schema={dockerComposeSchemaQuery.data}
      data-cy="stack-creation-editor"
    >
      您可以在{' '}
      <a
        href="https://docs.docker.com/compose/compose-file/"
        target="_blank"
        rel="noreferrer"
      >
        官方文档
      </a>
      中了解更多关于 Compose 文件格式的信息。
    </WebEditorForm>
  );
}
