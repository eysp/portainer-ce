import { useMutation, useQuery } from 'react-query';

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError } from '@/react-tools/react-query';

import { CustomTemplate } from '../types';

import { buildUrl } from './build-url';
import { queryKeys } from './query-keys';

type CustomTemplateFileContent = {
  FileContent: string;
};

export function useCustomTemplateFile(id?: CustomTemplate['Id'], git = false) {
  return useQuery(
    id ? queryKeys.file(id, { git }) : [],
    () => getCustomTemplateFile({ id: id!, git }),
    {
      ...withGlobalError('获取自定义模板文件失败'),
      enabled: !!id,
      // there's nothing to do with a new file content, so we're disabling refetch
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}

export function useCustomTemplateFileMutation() {
  return useMutation({
    mutationFn: getCustomTemplateFile,
    ...withGlobalError('获取自定义模板文件失败'),
  });
}

export function getCustomTemplateFile({
  git,
  id,
}: {
  id: CustomTemplate['Id'];
  git: boolean;
}) {
  return git ? getCustomTemplateGitFetch(id) : getCustomTemplateFileContent(id);
}

async function getCustomTemplateFileContent(id: number) {
  try {
    const {
      data: { FileContent },
    } = await axios.get<CustomTemplateFileContent>(
      buildUrl({ id, action: 'file' })
    );
    return FileContent;
  } catch (e) {
    throw parseAxiosError(e, '无法获取自定义模板文件内容');
  }
}

async function getCustomTemplateGitFetch(id: number) {
  try {
    const {
      data: { FileContent },
    } = await axios.put<CustomTemplateFileContent>(
      buildUrl({ id, action: 'git_fetch' })
    );
    return FileContent;
  } catch (e) {
    throw parseAxiosError(e, '无法获取自定义模板文件内容');
  }
}
