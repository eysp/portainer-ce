import { useState } from 'react';

import { Modal, OnSubmit, ModalType, openModal } from '@@/modals';
import { Button } from '@@/buttons';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

interface Props {
  onSubmit: OnSubmit<{ pullLatest: boolean }>;

  cannotPullImage: boolean;
}

function ConfirmRecreationModal({ onSubmit, cannotPullImage }: Props) {
  const [pullLatest, setPullLatest] = useState(false);

  return (
    <Modal
      onDismiss={() => onSubmit()}
      aria-label="确认重新创建容器弹窗"
    >
      <Modal.Header title="您确定吗？" modalType={ModalType.Destructive} />

      <Modal.Body>
        <p>
          您即将重新创建此容器，所有非持久化数据都将丢失。此容器将被删除，并使用相同配置创建一个新容器。
        </p>
        <SwitchField
          name="pullLatest"
          data-cy="recreate-pull-latest-switch"
          label="重新拉取镜像"
          checked={pullLatest}
          onChange={setPullLatest}
          disabled={cannotPullImage}
        />
        {cannotPullImage && (
          <div className="mt-1 text-sm">
            <TextTip color="orange">
              无法重新拉取镜像，因为镜像不可访问。它可能已不存在，或标签/名称不再正确。
            </TextTip>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => onSubmit()}
          color="default"
          data-cy="cancel-recreate"
        >
          取消
        </Button>
        <Button
          onClick={() => onSubmit({ pullLatest })}
          color="danger"
          data-cy="confirm-recreate"
        >
          重新创建
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export async function confirmContainerRecreation(cannotPullImage: boolean) {
  return openModal(ConfirmRecreationModal, {
    cannotPullImage,
  });
}
