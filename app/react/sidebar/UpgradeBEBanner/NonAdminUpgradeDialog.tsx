import { ExternalLink } from 'lucide-react';

import { Button } from '@@/buttons';
import { Modal } from '@@/modals/Modal';
import { ModalType } from '@@/modals/Modal/types';

export function NonAdminUpgradeDialog({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  return (
    <Modal aria-label="升级Portainer至商业版">
      <Modal.Header
        title="联系管理员"
        modalType={ModalType.Warn}
      />
      <Modal.Body>
      您需要以管理员身份登录才能将Portainer升级至企业版。
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <Button
            color="default"
            size="medium"
            className="w-1/3"
            onClick={() => onDismiss()}
          >
            取消
          </Button>

          <a
            href="https://www.portainer.io/take-5"
            target="_blank"
            rel="noreferrer"
            className="no-link w-2/3"
          >
            <Button
              color="primary"
              size="medium"
              className="w-full"
              icon={ExternalLink}
            >
              了解商业版
            </Button>
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
