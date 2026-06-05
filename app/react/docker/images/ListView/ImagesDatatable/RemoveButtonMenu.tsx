import { ChevronDown, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuPopover } from '@reach/menu-button';
import { positionRight } from '@reach/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Authorized } from '@/react/hooks/useUser';
import { withInvalidate } from '@/react-tools/react-query';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifySuccess } from '@/portainer/services/notifications';
import { processItemsInBatches } from '@/react/common/processItemsInBatches';

import { Button, ButtonGroup } from '@@/buttons';
import { ButtonWithRef } from '@@/buttons/Button';
import { confirmDestructive } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

import { ImagesListResponse } from '../../queries/useImages';
import { queryKeys } from '../../queries/queryKeys';
import { deleteImage } from '../../queries/useDeleteImageMutation';

export function RemoveButtonMenu({
  selectedItems,
}: {
  selectedItems: Array<ImagesListResponse>;
}) {
  const deleteImageListMutation = useDeleteImageListMutation();

  return (
    <Authorized authorizations="DockerImageDelete">
      <ButtonGroup>
        <Button
          size="small"
          color="dangerlight"
          icon={Trash2}
          disabled={selectedItems.length === 0}
          data-cy="image-removeImageButton"
          onClick={() => {
            handleRemove(false);
          }}
        >
          删除
        </Button>
        <Menu>
          <MenuButton
            as={ButtonWithRef}
            size="small"
            color="dangerlight"
            disabled={selectedItems.length === 0}
            icon={ChevronDown}
            data-cy="image-toggleRemoveButtonMenu"
          >
            <span className="sr-only">切换下拉菜单</span>
          </MenuButton>
          <MenuPopover position={positionRight}>
            <div className="mt-3 bg-white th-highcontrast:bg-black th-dark:bg-black">
              <MenuItem
                onSelect={() => {
                  handleRemove(true);
                }}
              >
                强制删除
              </MenuItem>
            </div>
          </MenuPopover>
        </Menu>
      </ButtonGroup>
    </Authorized>
  );

  function confirmForceRemove() {
    return confirmDestructive({
      title: '您确定吗？',
      message:
        '强制删除镜像会在镜像被已停止容器使用时仍然删除它，并删除所有关联标签。您确定要删除选中的镜像吗？',
      confirmButton: buildConfirmButton('删除镜像', 'danger'),
    });
  }

  function confirmRegularRemove() {
    return confirmDestructive({
      title: '您确定吗？',
      message:
        '删除镜像也会删除所有关联标签。您确定要删除选中的镜像吗？',
      confirmButton: buildConfirmButton('删除镜像', 'danger'),
    });
  }

  async function handleRemove(force: boolean) {
    const confirmed = await (force
      ? confirmForceRemove()
      : confirmRegularRemove());

    if (!confirmed) {
      return;
    }

    deleteImageListMutation.mutate({
      imageIds: selectedItems.map((image) => image.id),
      force,
    });
  }
}

function useDeleteImageListMutation() {
  const environmentId = useEnvironmentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      imageIds,
      ...args
    }: {
      imageIds: Array<string>;
    } & Omit<Parameters<typeof deleteImage>[0], 'imageId' | 'environmentId'>) =>
      processItemsInBatches(imageIds, (imageId) =>
        deleteImage({ ...args, environmentId, imageId }).then(() =>
          notifySuccess('镜像已成功删除', imageId)
        )
      ),
    ...withInvalidate(queryClient, [queryKeys.base(environmentId)]),
  });
}
