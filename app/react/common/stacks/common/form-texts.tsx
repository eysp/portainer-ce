import { StackType } from '../types';

const dockerTexts = {
  editor: {
    placeholder: '在此定义或粘贴你的 docker compose 文件内容',
    description: (
      <p>
        你可以在{' '}
        <a
          href="https://docs.docker.com/compose/compose-file/"
          target="_blank"
          rel="noreferrer"
        >
          官方文档
        </a>
        中获取关于 Compose 文件格式的更多信息。
      </p>
    ),
  },
  upload: '你可以从你的电脑上传一个 Compose 文件。',
} as const;

export const textByType = {
  [StackType.DockerCompose]: dockerTexts,
  [StackType.DockerSwarm]: dockerTexts,
  [StackType.Kubernetes]: {
    editor: {
      placeholder: '在此定义或粘贴你的清单文件内容',
      description: (
        <>
          <p>
            模板允许部署任何类型的 Kubernetes 资源
            （Deployment、Secret、ConfigMap 等）
          </p>
          <p>
            你可以在{' '}
            <a
              href="https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/"
              target="_blank"
              rel="noreferrer"
            >
              官方文档
            </a>
            中获取关于 Kubernetes 文件格式的更多信息。
          </p>
        </>
      ),
    },
    upload: '你可以从你的电脑上传一个清单文件。',
  },
} as const;
