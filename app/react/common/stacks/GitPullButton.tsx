import { capitalize } from 'lodash';
import { GitMerge } from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { Stack, StackType } from '@/react/common/stacks/types';
import { Authorized } from '@/react/hooks/useUser';
import { useUpdateGitStack } from '@/react/portainer/gitops/queries/useUpdateGitStack';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { confirmStackUpdate } from '@/react/common/stacks/common/confirm-stack-update';

import { Button } from '@@/buttons';
import { Icon } from '@@/Icon';

export function GitPullButton({ stack }: { stack: Stack }) {
  const router = useRouter();
  const mutation = useUpdateGitStack(stack.Id, stack.EndpointId);

  return (
    <Authorized authorizations="PortainerStackUpdate">
      <Button
        type="button"
        size="small"
        color="light"
        className="!ml-0"
        disabled={mutation.isLoading}
        onClick={handleClick}
        data-cy="git-pull-button"
      >
        <Icon icon={GitMerge} className="mr-1" />
        Pull and redeploy
      </Button>
    </Authorized>
  );

  async function handleClick() {
    const stackLabel =
      stack.Type === StackType.Kubernetes ? 'application' : 'stack';
    const result = await confirmStackUpdate(
      `从 git 拉取将覆盖对此 ${stackLabel === "application" ? "应用" : "堆栈"} 的任何本地更改，并可能导致服务中断。您要继续吗？`,
      false
    );
    if (!result) {
      return;
    }

    mutation.mutate(
      {
        RepullImageAndRedeploy: result.repullImageAndRedeploy,
        Env: stack.Env || [],
        Prune: stack.Option?.Prune,
      },
      {
        onSuccess: () => {
          notifySuccess(
            '成功',
            `${stackLabel === 'application' ? '应用' : '堆栈'}已成功拉取并重新部署`
          );
          router.stateService.reload();
        },
        onError: (err) => {
          notifyError('失败', err, '无法拉取并重新部署');
        },
      }
    );
  }
}
