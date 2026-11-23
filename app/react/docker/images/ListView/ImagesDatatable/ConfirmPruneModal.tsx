import { useState } from 'react';

import { Modal, OnSubmit, ModalType, openModal } from '@@/modals';
import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';

import { ImagesListResponse } from '../../queries/useImages';

interface Props {
  onSubmit: OnSubmit<{ pruneAll: boolean; clearBuildCache: boolean }>;
  images?: ImagesListResponse[];
}

function ConfirmPruneModal({ onSubmit, images = [] }: Props) {
  const [pruneAll, setPruneAll] = useState(false);
  const [clearBuildCache, setClearBuildCache] = useState(false);

  const hasUntaggedImages = images.some(
    (img) => !img.tags || img.tags.length === 0
  );
  const hasUnusedImages = images.some((img) => !img.used);
  const showValidationMessage =
    !pruneAll && !hasUntaggedImages && hasUnusedImages;

  return (
    <Modal onDismiss={() => onSubmit()} aria-label="确认清理镜像模态框">
      <Modal.Header title="您确定吗？" modalType={ModalType.Destructive} />
      <Modal.Body>
        <p>
          这将删除此环境中的所有无标签（悬空）镜像。
        </p>
        <div className="mb-4">
          <SwitchField
            name="pruneAll"
            data-cy="prune-all-unused-switch"
            label="删除所有未使用的镜像"
            tooltip="删除所有未使用的镜像，即使它们带有标签。"
            checked={pruneAll}
            onChange={setPruneAll}
          />
          {showValidationMessage && (
            <p className="text-muted mt-1 text-xs">
              没有可删除的无标签（悬空）镜像。
            </p>
          )}
        </div>
        <SwitchField
          name="clearBuildCache"
          data-cy="prune-clear-build-cache-switch"
          label="清理 Docker 构建缓存"
          tooltip="这会移除不再使用的缓存构建层。未来的构建可能需要更长的时间，直到缓存重新建立。"
          checked={clearBuildCache}
          onChange={setClearBuildCache}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => onSubmit()}
          color="default"
          data-cy="prune-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit({ pruneAll, clearBuildCache })}
          color="danger"
          data-cy="prune-confirm"
        >
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export async function confirmPruneImages(images?: ImagesListResponse[]) {
  return openModal(ConfirmPruneModal, { images });
}
