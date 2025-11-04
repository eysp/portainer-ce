import { ModalType } from '@@/modals';
import { ConfirmCallback, openConfirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmImageExport(callback: ConfirmCallback) {
  const result = await openConfirm({
    modalType: ModalType.Warn,
    title: '注意',
    message:
      '导出可能需要几分钟时间，导出进行中请勿离开页面。',
    confirmButton: buildConfirmButton('继续'),
  });

  callback(result);
}
