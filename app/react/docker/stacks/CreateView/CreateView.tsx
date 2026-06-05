import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { useIsSwarm } from '@/react/docker/proxy/queries/useInfo';
import { useSwarmId } from '@/react/docker/proxy/queries/useSwarm';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { CreateStackForm } from './CreateStackForm/CreateStackForm';

export function CreateView() {
  const environmentId = useEnvironmentId();

  const isSwarm = useIsSwarm(environmentId);
  const swarmIdQuery = useSwarmId(environmentId);

  if (isSwarm && swarmIdQuery.isLoading) {
    return null;
  }

  const swarmId = isSwarm && swarmIdQuery.data ? swarmIdQuery.data : '';

  return (
    <>
      <PageHeader title="创建堆栈" breadcrumbs="堆栈创建" reload />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body>
              <CreateStackForm
                environmentId={environmentId}
                isSwarm={isSwarm}
                swarmId={swarmId}
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
