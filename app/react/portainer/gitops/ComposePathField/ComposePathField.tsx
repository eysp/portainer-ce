import { useStateWrapper } from '@/react/hooks/useStateWrapper';

import { FormControl } from '@@/form-components/FormControl';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';

import { GitFormModel } from '../types';
import { isBE } from '../../feature-flags/feature-flags.service';

import { PathSelector } from './PathSelector';

interface Props {
  errors?: string;
  value: string;
  onChange(value: string): void;
  isCompose: boolean;
  model: GitFormModel;
  isDockerStandalone: boolean;
}

export function ComposePathField({
  value,
  onChange,
  isCompose,
  model,
  isDockerStandalone,
  errors,
}: Props) {
  const [inputValue, updateInputValue] = useStateWrapper(value, onChange);

  return (
    <div className="form-group">
      <span className="col-sm-12">
        <TextTip color="blue" className="mb-2">
          <span>
            指定从代码仓库根目录到{' '}
            {isCompose ? (
              'Compose 文件'
            ) : (
              <a
                href="https://kubernetes.io/docs/concepts/overview/working-with-objects/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kubernetes manifest 文件
              </a>
            )}{' '}
            的路径（需要 yaml, yml, json, 或 hcl 文件后缀）。
          </span>
          {isDockerStandalone && (
            <span className="ml-2">
              如需在 Docker 独立环境中重新构建已存在的镜像，请在您的 compose 文件中包含 
              <code>pull_policy: build</code>，参考{' '}
              <a href="https://docs.docker.com/reference/compose-file/services/#pull_policy">
                Docker 文档
              </a>
              。
            </span>
          )}
        </TextTip>
      </span>
      <div className="col-sm-12">
        <FormControl
          label={isCompose ? 'Compose 路径' : 'Manifest 路径'}
          inputId="stack_repository_path"
          required
          errors={errors}
        >
          {isBE ? (
            <PathSelector
              value={value}
              onChange={onChange}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              model={model}
              inputId="stack_repository_path"
            />
          ) : (
            <Input
              value={inputValue}
              data-cy="stack-repository-path-input"
              onChange={(e) => {
                updateInputValue(e.target.value);
              }}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              id="stack_repository_path"
            />
          )}
        </FormControl>
      </div>
    </div>
  );
}
