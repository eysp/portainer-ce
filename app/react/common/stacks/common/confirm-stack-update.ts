import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmStackUpdate(
  message: string,
  defaultValue: boolean
) {
  const result = await openSwitchPrompt(
    '您确定吗？',
    '重新拉取镜像并重新部署',
    {
      message: message || '您是否要强制更新此堆栈？',
      confirmButton: buildConfirmButton('更新'),
      modalType: ModalType.Warn,
      defaultValue,
      'data-cy': 'confirm-stack-update',
    }
  );

  return result ? { pullImage: result.value } : undefined;
}
