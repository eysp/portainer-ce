import { SchemaOf, object, boolean, string } from 'yup';

import { GitCredential } from '@/react/portainer/account/git-credentials/types';
import { buildGitValidationSchema } from '@/react/portainer/gitops/GitForm';

import { GitFormValues } from './types';

export function getGitValidationSchema({
  gitCredentials = [],
}: {
  gitCredentials: Array<GitCredential> | undefined;
}): SchemaOf<GitFormValues> {
  return buildGitValidationSchema(gitCredentials, false, 'compose').concat(
    object({
      SupportRelativePath: boolean().default(false),
      FilesystemPath: string()
        .default('')
        .when('SupportRelativePath', {
          is: true,
          then: string().required('文件系统路径为必填项'),
        }),
    })
  );
}
