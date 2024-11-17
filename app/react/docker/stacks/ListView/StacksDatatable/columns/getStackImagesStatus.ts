import axios from '@/portainer/services/axios';
import { ImageStatus } from '@/react/docker/components/ImageStatus/types';

export async function getStackImagesStatus(id: number) {
  try {
    const { data } = await axios.get<ImageStatus>(
      `/stacks/${id}/images_status`
    );
    return data;
  } catch (e) {
    return {
      Status: '未知',
      Message: `无法获取堆栈 ${id} 的镜像状态`,
    };
  }
}
