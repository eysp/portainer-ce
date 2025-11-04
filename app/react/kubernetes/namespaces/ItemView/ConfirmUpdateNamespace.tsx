import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

type Warnings = {
  quota: boolean;
  ingress: boolean;
  registries: boolean;
};

export function confirmUpdateNamespace(warnings: Warnings) {
  const message = (
    <>
      {warnings.quota && (
        <p>
          减少分配给"正在使用"命名空间的配额可能会产生意外后果，包括阻止正在运行的应用程序正常运作，甚至可能完全阻止它们运行。
        </p>
      )}
      {warnings.ingress && (
        <p>
          停用入口可能会使应用程序无法访问。受影响应用程序的所有入口配置将被移除。
        </p>
      )}
      {warnings.registries && (
        <p>
          您移除的某些注册表可能被此环境中的一个或多个应用程序使用。移除注册表访问可能导致这些应用程序的服务中断。
        </p>
      )}
      <p>您确定要继续吗？</p>
    </>
  );

  return confirm({
    title: '您确定吗？',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('更新', 'primary'),
  });
}
