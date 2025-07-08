import { ModalType } from '@@/modals';
import { openSwitchPrompt } from '@@/modals/SwitchPrompt';
import { buildConfirmButton } from '@@/modals/utils';

export async function confirmContainerDeletion(title: string) {
  const result = await openSwitchPrompt(
    title,
    '自动移删除非持久卷',
    {
      confirmButton: buildConfirmButton('删除', 'danger'),
      modalType: ModalType.Destructive,
      'data-cy': 'confirm-container-delete-button',
    }
  );

  return result ? { removeVolumes: result.value } : undefined;
}
