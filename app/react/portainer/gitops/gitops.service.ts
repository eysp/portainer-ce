import axios, { parseAxiosError } from '@/portainer/services/axios';

interface PreviewPayload {
  repository: string;
  targetFile: string;
  reference?: string;
  username?: string;
  password?: string;
  tlsSkipVerify?: boolean;
}

interface PreviewResponse {
  FileContent: string;
}

export async function getFilePreview(payload: PreviewPayload) {
  try {
    const {
      data: { FileContent },
    } = await axios.post<PreviewResponse>('/gitops/repo/file/preview', payload);
    return FileContent;
  } catch (e) {
    throw parseAxiosError(e as Error, '无法从 Git 获取文件');
  }
}
