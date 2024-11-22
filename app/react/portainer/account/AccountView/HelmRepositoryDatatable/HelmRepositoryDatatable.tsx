import { useMemo, useEffect } from 'react';

import { useCurrentUser } from '@/react/hooks/useUser';
import helm from '@/assets/ico/vendor/helm.svg?c';
import { isPureAdmin } from '@/portainer/users/user.helpers';

import { Link } from '@@/Link';
import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { TextTip } from '@@/Tip/TextTip';

import { columns } from './columns';
import { HelmRepositoryDatatableActions } from './HelmRepositoryDatatableActions';
import { useHelmRepositories } from './helm-repositories.service';
import { HelmRepository } from './types';

const storageKey = 'helmRepository';

const settingsStore = createPersistedStore(storageKey);

export function HelmRepositoryDatatable() {
  const { user } = useCurrentUser();
  const helmReposQuery = useHelmRepositories(user.Id);

  const isAdminUser = isPureAdmin(user);

  const tableState = useTableState(settingsStore, storageKey);

  const helmRepos = useMemo(() => {
    const helmRepos = [];
    if (helmReposQuery.data?.GlobalRepository) {
      const helmrepository: HelmRepository = {
        Global: true,
        URL: helmReposQuery.data.GlobalRepository,
        Id: 0,
        UserId: 0,
      };
      helmRepos.push(helmrepository);
    }
    return [...helmRepos, ...(helmReposQuery.data?.UserRepositories ?? [])];
  }, [
    helmReposQuery.data?.GlobalRepository,
    helmReposQuery.data?.UserRepositories,
  ]);

  useEffect(() => {
    // window.location.hash will get everything after the hashbang
    // the regex will match the the content after each hash
    const timeout = setTimeout(() => {
      const regEx = /#!.*#(.*)/;
      const match = window.location.hash.match(regEx);
      if (match && match[1]) {
        document.getElementById(match[1])?.scrollIntoView();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Datatable
      getRowId={(row) => String(row.Id)}
      dataset={helmRepos}
      description={<HelmDatatableDescription isAdmin={isAdminUser} />}
      settingsManager={tableState}
      columns={columns}
      title="Helm 仓库"
      titleIcon={helm}
      titleId="helm-repositories"
      renderTableActions={(selectedRows) => (
        <HelmRepositoryDatatableActions selectedItems={selectedRows} />
      )}
      emptyContentLabel="未找到 Helm 仓库"
      isLoading={helmReposQuery.isLoading}
      isRowSelectable={(row) => !row.original.Global}
    />
  );
}

function HelmDatatableDescription({ isAdmin }: { isAdmin: boolean }) {
  return (
    <TextTip color="blue" className="mb-3">
      在这里添加一个 Helm 仓库只会使其在您自己的用户账户的 Portainer UI 中可用。Helm charts 将从这些仓库 (以及{' '}
      {isAdmin ? (
        <Link to="portainer.settings" params={{ '#': 'kubernetes-settings' }}>
          <span>全局设置的 Helm 仓库</span>
        </Link>
      ) : (
        <span>全局设置的 Helm 仓库</span>
      )}
      ) 拉取，并显示在“从清单创建”页面的 Helm charts 列表中。
    </TextTip>
  );
}
