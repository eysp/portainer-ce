import { useCurrentStateAndParams } from '@uirouter/react';
import { Circle, Code as CodeIcon, File } from 'lucide-react';
import { useState } from 'react';

import { trimContainerName } from '@/docker/filters/utils';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { JsonTree } from '@@/JsonTree';
import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';
import { ButtonSelector } from '@@/form-components/ButtonSelector/ButtonSelector';
import { Code } from '@@/Code';

import { useContainerInspect } from '../queries/useContainerInspect';

export function InspectView() {
  const environmentId = useEnvironmentId();
  const {
    params: { id, nodeName },
  } = useCurrentStateAndParams();
  const inspectQuery = useContainerInspect(environmentId, id, { nodeName });
  const [viewType, setViewType] = useState<'tree' | 'text'>('tree');

  if (!inspectQuery.data) {
    return null;
  }

  const containerInfo = inspectQuery.data;

  return (
    <>
      <PageHeader
        title="容器检查"
        breadcrumbs={[
          { label: '容器', link: 'docker.containers' },
          {
            label: trimContainerName(containerInfo.Name),
            link: '^',
            // linkParams: { id: containerInfo.Id },
          },
          '检查',
        ]}
      />

      <div className="row">
        <div className="col-lg-12 col-md-12 col-xs-12">
          <Widget>
            <Widget.Title icon={Circle} title="检查">
              <ButtonSelector<'tree' | 'text'>
                onChange={(value) => setViewType(value)}
                value={viewType}
                options={[
                  {
                    label: '树状',
                    icon: CodeIcon,
                    value: 'tree',
                  },
                  {
                    label: '文本',
                    icon: File,
                    value: 'text',
                  },
                ]}
              />
            </Widget.Title>
            <Widget.Body>
              {viewType === 'text' && (
                <Code showCopyButton>
                  {JSON.stringify(containerInfo, undefined, 4)}
                </Code>
              )}
              {viewType === 'tree' && <JsonTree data={containerInfo} />}
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}
