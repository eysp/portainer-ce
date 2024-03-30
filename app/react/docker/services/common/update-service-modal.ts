import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmServiceForceUpdate(message: string) {
  const result = await openSwitchPrompt('确定吗？', '重新拉取镜像', {
    message,
    confirmButton: buildConfirmButton('更新'),
    modalType: ModalType.Warn,
  });

  return result ? { pullLatest: result.value } : undefined;
}
