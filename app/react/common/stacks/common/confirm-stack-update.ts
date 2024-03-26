import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { ModalType } from '@@/modals';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmStackUpdate(
  message: string,
  defaultValue: boolean
) {
  const result = await openSwitchPrompt(
    '你确定吗？',
    '重新拉取镜像并重新部署',
    {
      message,
      confirmButton: buildConfirmButton('更新'),
      modalType: ModalType.Warn,
      defaultValue,
    }
  );

  return result ? { pullImage: result.value } : undefined;
}
