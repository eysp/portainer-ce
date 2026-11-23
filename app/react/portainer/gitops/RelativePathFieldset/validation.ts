import { boolean, mixed, object, SchemaOf, string } from 'yup';

import { PerDevConfigsFilterType, RelativePathModel } from './types';

export function relativePathValidation(): SchemaOf<RelativePathModel> {
  return object({
    SupportRelativePath: boolean().default(false),
    FilesystemPath: string()
      .when(['SupportRelativePath'], {
        is: true,
        then: string().required('本地文件系统路径是必填项'),
      })
      .default(''),
    SupportPerDeviceConfigs: boolean().default(false),
    PerDeviceConfigsPath: string()
      .when('SupportPerDeviceConfigs', {
        is: true,
        then: string().required('目录是必填项'),
      })
      .default(''),
    PerDeviceConfigsMatchType: mixed<PerDevConfigsFilterType>()
      .oneOf(['', 'file', 'dir'])
      .default(''),
    PerDeviceConfigsGroupMatchType: mixed<PerDevConfigsFilterType>()
      .oneOf(['', 'file', 'dir'])
      .default(''),
  });
}
