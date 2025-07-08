import axios, { parseAxiosError } from '@/portainer/services/axios';
import { ImageStatus } from '@/react/docker/components/ImageStatus/types';

export async function getStackImagesStatus(id: number) {
  try {
    const { data } = await axios.get<ImageStatus>(
      `/stacks/${id}/images_status`
    );
    return data;
  } catch (e) {
    throw parseAxiosError(
      e,
      `无法获取堆栈的镜像状态： ${id}`
    );
  }
}
