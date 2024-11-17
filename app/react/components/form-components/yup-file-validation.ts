import { mixed } from 'yup';
import { MixedSchema } from 'yup/lib/mixed';

type FileSchema = MixedSchema<File | undefined>;

export function file(): FileSchema {
  return mixed();
}

export function withFileSize(fileValidation: FileSchema, maxSize: number) {
  return fileValidation.test(
    'fileSize',
    '所选文件太大。',
    validateFileSize
  );

  function validateFileSize(file?: File) {
    if (!file) {
      return true;
    }

    return file.size <= maxSize;
  }
}

export function withFileExtension(
  fileValidation: FileSchema,
  allowedExtensions: string[]
) {
  return fileValidation.test(
    'fileExtension',
    '所选文件具有无效的扩展名。',
    validateFileExtension
  );

  function validateFileExtension(file?: File) {
    if (!file) {
      return true;
    }

    const fileExtension = file.name.split('.').pop();

    return allowedExtensions.includes(fileExtension || '');
  }
}
