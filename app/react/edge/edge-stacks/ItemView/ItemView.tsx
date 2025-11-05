import { HardDriveIcon, LayersIcon } from 'lucide-react';

import { EditEdgeStackForm } from '@/react/edge/edge-stacks/ItemView/EditEdgeStackForm/EditEdgeStackForm';
import { useParamState } from '@/react/hooks/useParamState';
import { useIdParam } from '@/react/hooks/useIdParam';

import { NavTabs } from '@@/NavTabs';
import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';

import { useEdgeStack } from '../queries/useEdgeStack';

import { EnvironmentsDatatable } from './EnvironmentsDatatable';

export function ItemView() {
  const idParam = useIdParam('stackId');
  const edgeStackQuery = useEdgeStack(idParam);

  const [tab = 'stack', setTab] = useParamState<'stack' | 'environments'>(
    'tab'
  );

  if (!edgeStackQuery.data) {
    return null;
  }

  const stack = edgeStackQuery.data;

  return (
    <>
      <PageHeader
        title="编辑边缘堆栈"
        breadcrumbs={[
          { label: '边缘堆栈', link: 'edge.stacks' },
          stack.Name,
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Body className="!p-0">
              <NavTabs<'stack' | 'environments'>
                justified
                type="pills"
                options={[
                  {
                    id: 'stack',
                    label: '堆栈',
                    icon: LayersIcon,
                    children: (
                      <div className="p-5 pb-10">
                        <EditEdgeStackForm edgeStack={stack} />
                      </div>
                    ),
                  },
                  {
                    id: 'environments',
                    icon: HardDriveIcon,
                    label: '环境',
                    children: <EnvironmentsDatatable />,
                  },
                ]}
                selectedId={tab}
                onSelect={setTab}
              />
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
