import { ModalType } from '@@/modals';
import { ConfirmCallback, openConfirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmImageExport(callback: ConfirmCallback) {
  const result = await openConfirm({
    modalType: ModalType.Warn,
    title: '警告',
    message:
      '导出可能需要几分钟，请在导出过程中不要离开页面。.',
    confirmButton: buildConfirmButton('继续'),
  });

  callback(result);
}
