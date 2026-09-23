import { ChevronDown, Trash2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuPopover } from '@reach/menu-button';
import { positionRight } from '@reach/popover';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Authorized } from '@/react/hooks/useUser';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { getAllSettledItems } from '@/portainer/helpers/promise-utils';
import { pluralize } from '@/portainer/helpers/strings';

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
          />
          <MenuPopover position={positionRight}>
            <MenuItem
              onSelect={() => {
                handleRemove(true);
              }}
              data-cy="image-forceRemoveImageButton"
            >
              强制删除
            </MenuItem>
          </MenuPopover>
        </Menu>
      </ButtonGroup>
    </Authorized>
  );

  function confirmForceRemove() {
    return confirmDestructive({
      title: '您确定吗？',
      message:
        '强制删除使用中及停止使用的镜像，同时也将删除其相关的标签。您确定要删除选中的镜像吗？',
      confirmButton: buildConfirmButton('确认删除', 'danger'),
    });
  }

  function confirmRegularRemove() {
    return confirmDestructive({
      title: '您确定吗？',
      message:
        '删除镜像将会同时删除其相关的标签。您确定要删除选中的镜像吗？',
      confirmButton: buildConfirmButton('确认删除', 'danger'),
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
      images: selectedItems.map((image) => ({
        id: image.id,
        nodeName: image.nodeName,
      })),
      force,
    });
  }
}

type ImageToDelete = { id: string; nodeName?: string };

function useDeleteImageListMutation() {
  const environmentId = useEnvironmentId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      images,
      force,
    }: {
      images: Array<ImageToDelete>;
      force?: boolean;
    }) =>
      getAllSettledItems(images, (image) =>
        deleteImage({
          environmentId,
          imageId: image.id,
          nodeName: image.nodeName,
          force,
        })
      ),
    onSuccess: ({ fulfilledItems, rejectedItems }) => {
      // one error notification per rejected item
      rejectedItems.forEach(({ item, reason }) => {
        notifyError(删除 ' + item.id + ' 失败, new Error(reason));
      });

      // one success notification for all fulfilled items
      if (fulfilledItems.length) {
        notifySuccess(
          成功删除  + fulfilledItems.length +  个镜像,
          fulfilledItems.map((item) => item.id).join(', ')
        );
      }

      return queryClient.invalidateQueries(queryKeys.base(environmentId));
    },
  });
}
