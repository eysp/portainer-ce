import { FileText } from 'lucide-react';

import { Link } from '@@/Link';
import { Icon } from '@@/Icon';

import { columnHelper } from './helper';

export const actions = columnHelper.accessor(() => '', {
  header: 'Actions',
  id: 'actions',
  enableSorting: false,
  cell: ({ row: { original: job } }) => (
    <div className="flex gap-x-2">
      <Link
        className="flex items-center gap-1"
        to="kubernetes.applications.application.logs"
        params={{
          name: job.PodName,
          namespace: job.Namespace,
          pod: job.PodName,
          container: job.Container?.name,
        }}
        data-cy={`job-logs-${job.Namespace}-${job.Name}-${job.Container?.name}`}
      >
        <Icon icon={FileText} />
        Logs
      </Link>
    </div>
  ),
});
