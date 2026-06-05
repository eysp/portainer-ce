import { Edit2, List } from 'lucide-react';
import _ from 'lodash';

import { useParamState } from '@/react/hooks/useParamState';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { Stack } from '@/react/common/stacks/types';
import { useStackFile } from '@/react/common/stacks/queries/useStackFile';

import { NavTabs } from '@@/NavTabs';
import { WidgetBody, Widget } from '@@/Widget';

import { useContainers } from '../../containers/queries/useContainers';
import { validateYAML } from '../common/stackYamlValidation';
import { extractContainerNames } from '../common/container-names';

import { StackEditorTab } from './StackEditorTab/StackEditorTab';
import { StackInfoTab } from './StackInfoTab/StackInfoTab';

type Tab = 'info' | 'editor';

export function StackDetails({
  isExternal,
  isOrphaned,
  isOrphanedRunning,
  isRegular,
  stackName,

  stack,
}: {
  isOrphaned: boolean;
  isExternal: boolean;
  isOrphanedRunning: boolean;
  isRegular: boolean;
  stackName: string;
  stack: Stack | undefined;
}) {
  const envId = useEnvironmentId();
  const containerNamesQuery = useContainers(envId, {
    select: (containers) =>
      containers.flatMap((c) => c.Names).map((n) => _.trimStart(n, '/')),
  });
  const [tab, setTab] = useParamState<Tab>('tab', (param) =>
    param === 'editor' ? param : 'info'
  );
  const fileQuery = useStackFile(stack?.Id, {
    version: stack?.StackFileVersion,
    commitHash: stack?.GitConfig?.ConfigHash,
  });
  const stackFileContent = fileQuery.data?.StackFileContent;
  const originalContainerNames = extractContainerNames(stackFileContent);
  const yamlError = validateYAML(
    stackFileContent || '',
    containerNamesQuery.data,
    originalContainerNames
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            <NavTabs<Tab>
              selectedId={tab}
              onSelect={(tab) => {
                setTab(tab);
              }}
              options={_.compact([
                {
                  id: 'info',
                  label: '堆栈',
                  icon: List,
                  children: (
                    <StackInfoTab
                      environmentId={envId}
                      isExternal={isExternal}
                      isOrphaned={isOrphaned}
                      isOrphanedRunning={isOrphanedRunning}
                      stackName={stackName}
                      isRegular={isRegular}
                      stack={stack}
                      stackFileContent={stackFileContent}
                      yamlError={yamlError}
                    />
                  ),
                },
                !isExternal &&
                !!stack &&
                !fileQuery.isLoading &&
                (!stack.GitConfig || stack.FromAppTemplate)
                  ? {
                      id: 'editor',
                      icon: Edit2,
                      label: '编辑器',
                      children: (
                        <StackEditorTab
                          stack={stack}
                          isOrphaned={isOrphaned}
                          originalFileContent={stackFileContent || ''}
                          containerNames={containerNamesQuery.data}
                          originalContainerNames={originalContainerNames}
                          onSubmitSuccess={() => setTab('info')}
                        />
                      ),
                    }
                  : undefined,
              ])}
            />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
