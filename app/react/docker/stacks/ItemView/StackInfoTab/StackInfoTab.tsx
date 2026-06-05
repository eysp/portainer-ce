import { AlertTriangle } from 'lucide-react';

import { EnvironmentId } from '@/react/portainer/environments/types';
import { Stack, StackStatus, StackType } from '@/react/common/stacks/types';
import { Authorized } from '@/react/hooks/useUser';

import { Icon } from '@@/Icon';
import { FormSection } from '@@/form-components/FormSection';

import { useSwarmStackResources } from '../useSwarmStackServices';
import { useComposeStackContainers } from '../useComposeStackContainers';

import { StackDuplicationForm } from './StackDuplicationForm/StackDuplicationForm';
import { StackRedeployGitForm } from './StackRedeployGitForm/StackRedeployGitForm';
import { StackActions } from './StackActions';
import { AssociateStackForm } from './AssociateStackForm';

interface StackInfoTabProps {
  stack?: Stack; // will be loaded only if regular or orphaned
  stackName: string;
  stackFileContent?: string;
  isRegular?: boolean;
  isExternal: boolean;
  isOrphaned: boolean;
  isOrphanedRunning: boolean;
  environmentId: number;
  yamlError?: string;
}

export function StackInfoTab({
  stack,
  stackName,
  stackFileContent,
  isRegular,
  isExternal,
  isOrphaned,
  isOrphanedRunning,
  environmentId,
  yamlError,
}: StackInfoTabProps) {
  const status = useStackStatus({
    status: stack?.Status,
    environmentId,
    name: stackName,
    type: stack?.Type,
  });

  return (
    <>
      <ExternalOrphanedWarning
        isExternal={isExternal}
        isOrphaned={isOrphaned || isOrphanedRunning}
      />

      <FormSection title="堆栈详情">
        <div className="form-group">
          {stackName}

          {stack && (
            <div className="inline-flex ml-3">
              <StackActions
                stack={stack}
                fileContent={stackFileContent}
                isRegular={isRegular}
                environmentId={environmentId}
                isExternal={isExternal}
                status={status}
              />
            </div>
          )}
        </div>
      </FormSection>

      {stack && (
        <>
          {isOrphaned ? (
            <AssociateStackForm
              stackName={stackName}
              environmentId={environmentId}
              isOrphanedRunning={isOrphanedRunning}
              stackId={stack.Id}
            />
          ) : (
            <>
              {stack.GitConfig && !stack.FromAppTemplate && (
                <Authorized authorizations="PortainerStackUpdate">
                  <StackRedeployGitForm stack={stack} />
                </Authorized>
              )}

              {isRegular && (
                <StackDuplicationForm
                  yamlError={yamlError}
                  currentEnvironmentId={environmentId}
                  originalFileContent={stackFileContent || ''}
                  stack={stack}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

function ExternalOrphanedWarning({
  isExternal,
  isOrphaned,
}: {
  isExternal: boolean;
  isOrphaned: boolean;
}) {
  if (!isExternal && !isOrphaned) return null;

  return (
    <FormSection title="信息">
      <div className="form-group">
        <span className="small">
          <p className="text-muted flex items-start gap-1">
            <Icon icon={AlertTriangle} mode="warning" className="!mr-0" />
            {isExternal && (
              <span>
                此堆栈是在 Portainer 外部创建的。对此堆栈的控制有限。
              </span>
            )}
            {isOrphaned && (
              <span>
                此堆栈是孤立的。您可以使用"关联到此环境"功能将其重新关联到当前环境。
              </span>
            )}
          </p>
        </span>
      </div>
    </FormSection>
  );
}

function useStackStatus({
  status,
  name,
  type,
  environmentId,
}: {
  status: Stack['Status'] | undefined;
  name: string;
  type: Stack['Type'] | undefined;
  environmentId: EnvironmentId;
}) {
  const servicesQuery = useSwarmStackResources(name, {
    enabled: type === StackType.DockerSwarm && !status,
  });
  const containersQuery = useComposeStackContainers(
    { environmentId, stackName: name },
    {
      enabled: type === StackType.DockerCompose && !status,
    }
  );

  const derivedSwarmStatus = servicesQuery.data?.length
    ? StackStatus.Active
    : StackStatus.Inactive;
  const derivedComposeStatus = containersQuery.data?.length
    ? StackStatus.Active
    : StackStatus.Inactive;
  const derivedStatus =
    type === StackType.DockerSwarm ? derivedSwarmStatus : derivedComposeStatus;

  return status || derivedStatus;
}
