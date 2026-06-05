import { columnHelper } from './helper';

export const imagePullPolicy = columnHelper.accessor('imagePullPolicy', {
  header: '镜像拉取策略',
  id: 'imagePullPolicy',
});
