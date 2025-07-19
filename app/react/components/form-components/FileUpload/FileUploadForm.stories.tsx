import { Meta } from '@storybook/react';
import { useState } from 'react';

import { FileUploadForm } from './FileUploadForm';

export default {
  component: FileUploadForm,
  title: 'Components/Form/FileUploadForm',
} as Meta;

interface Args {
  title: string;
}

export { Example };

function Example({ title }: Args) {
  const [value, setValue] = useState<File>();
  function onChange(value: File) {
    if (value) {
      setValue(value);
    }
  }

  return (
    <div className="form-horizontal">
      <FileUploadForm
        onChange={onChange}
        value={value}
        title={title}
        description={
          <span>您可以从您的电脑上传 Compose 文件。</span>
        }
        data-cy="file-upload-form"
      />
    </div>
  );
}
