import { confirm } from '@@/modals/confirm';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmDisassociate() {
  const message = (
    <>
      <p>
        取消关联此边缘环境将标记其为未关联，并清除注册的边缘 ID。
      </p>
      <p>
        任何使用与此环境关联的边缘密钥启动的代理都将能够重新关联到此环境。
      </p>
      <p>
        您可以重新使用用于部署现有边缘代理的边缘 ID 和边缘密钥，将新的边缘设备与此环境关联。
      </p>
    </>
  );

  return confirm({
    title: '关于取消关联',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('取消关联'),
  });
}
