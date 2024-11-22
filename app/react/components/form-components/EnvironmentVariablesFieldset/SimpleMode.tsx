import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

import { readFileAsText } from '@/portainer/services/fileUploadReact';

import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { FileUploadField } from '@@/form-components/FileUpload';
import { InputList } from '@@/form-components/InputList';
import { ArrayError } from '@@/form-components/InputList/InputList';

import type { Values } from './types';
import { parseDotEnvFile } from './utils';
import { EnvironmentVariableItem } from './EnvironmentVariableItem';

export function SimpleMode({
  value,
  onChange,
  onAdvancedModeClick,
  errors,
  canUndoDelete,
}: {
  value: Values;
  onChange: (value: Values) => void;
  onAdvancedModeClick: () => void;
  errors?: ArrayError<Values>;
  canUndoDelete?: boolean;
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
        切换到高级模式以复制和粘贴多个变量
      </TextTip>

      <InputList
        aria-label="环境变量列表"
        onChange={onChange}
        value={value}
        isAddButtonHidden
        item={EnvironmentVariableItem}
        errors={errors}
        canUndoDelete={canUndoDelete}
      />

      <div className="flex gap-2">
        <Button
          onClick={() =>
            onChange([...value, { name: '', value: '', needsDeletion: false }])
          }
          className="!ml-0"
          color="default"
          icon={Plus}
        >
          添加环境变量
        </Button>

        <FileEnv onChooseFile={(add) => onChange([...value, ...add])} />
      </div>
    </>
  );
}

function FileEnv({ onChooseFile }: { onChooseFile: (file: Values) => void }) {
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
          文件太大！尝试上传小于 1MB 的文件
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
