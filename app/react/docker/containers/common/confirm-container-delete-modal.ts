import { ModalType } from '@@/modals';
import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmContainerDeletion(title: string) {
  const result = await openSwitchPrompt(
    title,
    '自动删除非持久化存储卷',
    {
      confirmButton: buildConfirmButton('删除', 'danger'),
      modalType: ModalType.Destructive,
    }
  );

  return result ? { removeVolumes: result.value } : undefined;
}
