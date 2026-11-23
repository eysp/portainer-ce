import { CellContext } from '@tanstack/react-table';

import { ImagesListResponse } from '@/react/docker/images/queries/useImages';

import { Badge } from '@@/Badge';
import { Tooltip } from '@@/Tip/Tooltip/Tooltip';

import { columnHelper } from './helper';

export const tags = columnHelper.accessor(
  (item) => (isDangling(item.tags) ? '虚悬 (Dangling)' : item.tags?.join(',')),
  {
    id: 'tags',
    header: '标签',
    cell: Cell,
  }
);

function Cell({
  row: { original: item },
}: CellContext<ImagesListResponse, unknown>) {
  const repoTags = item.tags;
  const isDanglingImage = isDangling(repoTags);

  if (isDanglingImage) {
    return (
      <Badge type="muted">
        虚悬 (Dangling)
        <Tooltip message="虚悬镜像即未打标签且不再被任何镜像仓库引用的无用镜像。" />
      </Badge>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {repoTags?.map((tag, idx) => (
        <Badge key={idx} type="info">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function isDangling(tags?: string[]) {
  return !tags || tags.length === 0;
}
