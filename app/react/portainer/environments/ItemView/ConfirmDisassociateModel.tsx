import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmDisassociate() {
  const message = (
    <>
      <p>
        解除关联此边缘环境会将其标记为未关联，并清除已注册的边缘 ID (Edge ID)。
      </p>
      <p>
        任何使用与此环境关联的边缘密钥 (Edge Key) 启动的 Agent 都将能够重新与此环境关联。
      </p>
      <p>
        您可以重复使用部署现有 Edge Agent 所用的边缘 ID 和边缘密钥，将新的边缘设备关联到此环境。
      </p>
    </>
  );

  return confirm({
    title: '关于解除关联',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('解除关联'),
  });
}
