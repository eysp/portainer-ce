import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

import { readFileAsText } from '@/portainer/services/fileUploadReact';

import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { FileUploadField } from '@@/form-components/FileUpload';
import { InputList } from '@@/form-components/InputList';
import { ArrayError, ItemProps } from '@@/form-components/InputList/InputList';
import { InputLabeled } from '@@/form-components/Input/InputLabeled';

import { FormError } from '../FormError';

import { type EnvVar, type Value } from './types';
import { parseDotEnvFile } from './utils';

export function SimpleMode({
  value,
  onChange,
  onAdvancedModeClick,
  errors,
}: {
  value: Value;
  onChange: (value: Value) => void;
  onAdvancedModeClick: () => void;
  errors?: ArrayError<Value>;
}) {
  return (
    <>
      <Button
        size="small"
        color="link"
        icon={Edit}
        className="!ml-0 p-0 hover:no-underline"
        onClick={onAdvancedModeClick}
      >
        高级模式
      </Button>

      <TextTip color="blue" inline={false}>
        切换到高级模式以复制并粘贴多个变量
      </TextTip>

      <InputList
        aria-label="环境变量列表"
        onChange={onChange}
        value={value}
        isAddButtonHidden
        item={Item}
        errors={errors}
      />

      <div className="flex gap-2">
        <Button
          onClick={() => onChange([...value, { name: '', value: '' }])}
          color="default"
          icon={Plus}
        >
          添加一个环境变量
        </Button>

        <FileEnv onChooseFile={(add) => onChange([...value, ...add])} />
      </div>
    </>
  );
}

function Item({
  item,
  onChange,
  disabled,
  error,
  readOnly,
  index,
}: ItemProps<EnvVar>) {
  return (
    <div className="relative flex w-full flex-col">
      <div className="flex w-full items-center gap-2">
        <InputLabeled
          className="w-1/2"
          label="名称"
          value={item.name}
          onChange={(e) => handleChange({ name: e.target.value })}
          disabled={disabled}
          readOnly={readOnly}
          placeholder="例如 FOO"
          size="small"
          id={`env-name${index}`}
        />
        <InputLabeled
          className="w-1/2"
          label="值"
          value={item.value}
          onChange={(e) => handleChange({ value: e.target.value })}
          disabled={disabled}
          readOnly={readOnly}
          placeholder="例如 bar"
          size="small"
          id={`env-value${index}`}
        />
      </div>

      {!!error && (
        <div className="absolute -bottom-5">
          <FormError className="m-0">{Object.values(error)[0]}</FormError>
        </div>
      )}
    </div>
  );

  function handleChange(partial: Partial<EnvVar>) {
    onChange({ ...item, ...partial });
  }
}

function FileEnv({ onChooseFile }: { onChooseFile: (file: Value) => void }) {
  const [file, setFile] = useState<File | null>(null);

  const fileTooBig = file && file.size > 1024 * 1024;

  return (
    <>
      <FileUploadField
        inputId="env-file-upload"
        onChange={handleChange}
        title="从 .env 文件加载变量"
        accept=".env"
        value={file}
        color="default"
      />

      {fileTooBig && (
        <TextTip color="orange" inline>
          文件过大！尝试上传小于 1MB 的文件
        </TextTip>
      )}
    </>
  );

  async function handleChange(file: File) {
    setFile(file);
    if (!file) {
      return;
    }

    const text = await readFileAsText(file);
    if (!text) {
      return;
    }

    const parsed = parseDotEnvFile(text);
    onChooseFile(parsed);
  }
}
