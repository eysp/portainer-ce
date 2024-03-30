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
            从你的仓库根目录指定 {isCompose ? 'Compose' : 'Manifest'} 
            文件的路径 (需要带有 yaml、yml、json 或 hcl 文件扩展名)。
          </span>
          {isDockerStandalone && (
            <span className="ml-2">
              要在 Docker 独立环境中启用对已存在镜像的重新构建，
              请在你的 compose 文件中包含
              <code>pull_policy: build</code> 参考{' '}
              <a href="https://docs.docker.com/compose/compose-file/#pull_policy">
                Docker 文档
              </a>
              。
            </span>
          )}
        </TextTip>
      </span>
      <div className="col-sm-12">
        <FormControl
          label={isCompose ? 'Compose path' : 'Manifest path'}
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
            />
          ) : (
            <Input
              value={inputValue}
              onChange={(e) => {
                updateInputValue(e.target.value);
              }}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
            />
          )}
        </FormControl>
      </div>
    </div>
  );
}
