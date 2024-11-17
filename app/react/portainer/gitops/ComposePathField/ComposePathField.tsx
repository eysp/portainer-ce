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
  createdFromCustomTemplateId?: number;
}

export function ComposePathField({
  value,
  onChange,
  isCompose,
  model,
  isDockerStandalone,
  errors,
  createdFromCustomTemplateId,
}: Props) {
  const [inputValue, updateInputValue] = useStateWrapper(value, onChange);

  return (
    <div className="form-group">
      <span className="col-sm-12">
        <TextTip color="blue" className="mb-2">
          <span>
            指定从仓库根目录到 {isCompose ? 'Compose' : 'Manifest'} 文件的路径
            （要求文件扩展名为 yaml、yml、json 或 hcl）。
          </span>
          {isDockerStandalone && (
            <span className="ml-2">
              若要在 Docker 独立环境中启用镜像重建（如果镜像已存在），
              请在您的 Compose 文件中包括
              <code>pull_policy: build</code> 如r{' '}
              <a href="https://docs.docker.com/compose/compose-file/#pull_policy">
                文档
              </a>
              中所示。
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
              createdFromCustomTemplateId={createdFromCustomTemplateId}
            />
          ) : (
            <Input
              value={inputValue}
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
