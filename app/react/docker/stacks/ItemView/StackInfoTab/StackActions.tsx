import {
  ArrowRightIcon,
  PlayIcon,
  PlusIcon,
  StopCircleIcon,
  Trash2Icon,
} from 'lucide-react';
import { useRouter } from '@uirouter/react';

import { Authorized } from '@/react/hooks/useUser';
import { Stack, StackStatus } from '@/react/common/stacks/types';
import { useDeleteStackMutation } from '@/react/common/stacks/queries/useDeleteStackMutation';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';

import { Button, LoadingButton } from '@@/buttons';
import { Link } from '@@/Link';
import { confirm, confirmDelete } from '@@/modals/confirm';
import { ModalType } from '@@/modals/Modal/types';
import { buildConfirmButton } from '@@/modals/utils';

import { useUpdateStackMutation } from '../../useUpdateStack';

import { useStartStackMutation } from './useStartStackMutation';
import { useStopStackMutation } from './useStopStackMutation';

export function StackActions({
  stack,
  fileContent,
  isRegular,
  environmentId,
  isExternal,
  status,
}: {
  stack: Stack;
  fileContent?: string;
  isRegular?: boolean;
  environmentId: number;
  isExternal: boolean;
  status: Stack['Status'];
}) {
  const router = useRouter();
  const startStackMutation = useStartStackMutation();
  const stopStackMutation = useStopStackMutation();
  const deleteStackMutation = useDeleteStackMutation();
  const detachFromGitMutation = useUpdateStackMutation();

  const isMutating =
    startStackMutation.isLoading ||
    stopStackMutation.isLoading ||
    deleteStackMutation.isLoading ||
    detachFromGitMutation.isLoading;

  const stackId = stack.Id;

  return (
    <div className="flex items-center gap-2">
      {isRegular && (
        <Authorized authorizations="PortainerStackUpdate">
          {status === StackStatus.Active ? (
            <Button
              icon={StopCircleIcon}
              color="dangerlight"
              size="xsmall"
              onClick={() => handleStop()}
              disabled={isMutating}
              data-cy="stack-stop-btn"
            >
              停止此堆栈
            </Button>
          ) : (
            <Button
              icon={PlayIcon}
              color="success"
              data-cy="stack-start-btn"
              size="xsmall"
              disabled={isMutating}
              onClick={() =>
                startStackMutation.mutate(
                  { id: stackId, environmentId },
                  {
                    onError(err) {
                      notifyError(
                        '失败',
                        err as Error,
                        '无法启动堆栈'
                      );
                    },
                    onSuccess() {
                      notifySuccess(
                        '成功',
                        `堆栈 ${stack.Name} 已成功启动`
                      );
                      router.stateService.reload();
                    },
                  }
                )
              }
            >
              启动此堆栈
            </Button>
          )}
        </Authorized>
      )}

      <Authorized authorizations="PortainerStackDelete">
        <Button
          icon={Trash2Icon}
          color="dangerlight"
          size="xsmall"
          onClick={() => handleDelete()}
          disabled={isMutating}
          data-cy="stack-delete-btn"
        >
          删除此堆栈
        </Button>
      </Authorized>

      {!!(isRegular && fileContent) && (
        <Button
          as={Link}
          icon={PlusIcon}
          color="primary"
          size="xsmall"
          data-cy="stack-create-template-btn"
          props={{
            to: 'docker.templates.custom.new',
            params: {
              fileContent,
              type: stack.Type,
            },
          }}
        >
          从堆栈创建模板
        </Button>
      )}

      {!!(
        isRegular &&
        fileContent &&
        !stack.FromAppTemplate &&
        stack.GitConfig
      ) && (
        <Authorized authorizations="PortainerStackUpdate">
          <LoadingButton
            icon={ArrowRightIcon}
            color="primary"
            size="xsmall"
            onClick={() => handleDetachFromGit()}
            disabled={isMutating}
            data-cy="stack-detach-git-btn"
            isLoading={detachFromGitMutation.isLoading}
            loadingText="正在分离..."
          >
            从 Git 分离
          </LoadingButton>
        </Authorized>
      )}
    </div>
  );

  async function handleStop() {
    const confirmed = await confirm({
      title: '您确定吗？',
      modalType: ModalType.Warn,
      message: '您确定要停止此堆栈吗？',
      confirmButton: buildConfirmButton('停止', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    stopStackMutation.mutate(
      { id: stackId, environmentId },
      {
        onError(err) {
          notifyError('失败', err as Error, '无法停止堆栈');
        },
        onSuccess() {
          notifySuccess('成功', `堆栈 ${stack.Name} 已成功停止`);
          router.stateService.reload();
        },
      }
    );
  }

  async function handleDelete() {
    const confirmed = await confirmDelete(
      '您要删除堆栈吗？关联的服务也将被删除'
    );
    if (!confirmed) {
      return;
    }
    deleteStackMutation.mutate(
      {
        id: stack.Id,
        name: stack.Name,
        environmentId: stack.EndpointId,
        external: isExternal,
      },
      {
        onError(err) {
          notifyError(
            '失败',
            err as Error,
            `无法删除堆栈 ${stack.Name}`
          );
        },
        onSuccess() {
          notifySuccess('堆栈已成功删除', stack.Name);
          router.stateService.go('^');
        },
      }
    );
  }

  async function handleDetachFromGit() {
    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: '您确定吗？',
      message: '您要将堆栈从 Git 分离吗？',
      confirmButton: buildConfirmButton('分离', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    detachFromGitMutation.mutate(
      {
        environmentId,
        stackId: stack.Id,
        payload: {
          stackFileContent: fileContent!,
          env: stack.Env,
          prune: false,
        },
      },
      {
        onSuccess() {
          router.stateService.go('^');
        },
      }
    );
  }
}
