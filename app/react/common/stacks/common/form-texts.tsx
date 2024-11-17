import { StackType } from '../types';

const dockerTexts = {
  editor: {
    placeholder: '在此处定义或粘贴您的 Docker Compose 文件内容',
    description: (
      <p>
        您可以在{' '}
        <a
          href="https://docs.docker.com/compose/compose-file/"
          target="_blank"
          rel="noreferrer"
        >
          官方文档
        </a>
        中获取有关 Compose 文件格式的更多信息。
      </p>
    ),
  },
  upload: '您可以从您的计算机上传一个 Compose 文件。',
} as const;

export const textByType = {
  [StackType.DockerCompose]: dockerTexts,
  [StackType.DockerSwarm]: dockerTexts,
  [StackType.Kubernetes]: {
    editor: {
      placeholder: '在此处定义或粘贴您的清单文件内容',
      description: (
        <>
          <p>
            模板允许部署任何类型的 Kubernetes 资源
            (Deployment, Secret, ConfigMap...)
          </p>
          <p>
            您可以在{' '}
            <a
              href="https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/"
              target="_blank"
              rel="noreferrer"
            >
              官方文档
            </a>
            中获取有关 Kubernetes 文件格式的更多信息。
          </p>
        </>
      ),
    },
    upload: '您可以从您的计算机上传一个清单文件。',
  },
} as const;
