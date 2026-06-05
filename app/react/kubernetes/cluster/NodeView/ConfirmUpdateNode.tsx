import { ModalType } from '@@/modals';
import { confirm } from '@@/modals/confirm';
import { buildConfirmButton } from '@@/modals/utils';

export function confirmUpdateNode(
  taintsWarning: boolean,
  labelsWarning: boolean,
  cordonWarning: boolean,
  drainWarning: boolean
) {
  let message;
  if (taintsWarning && !labelsWarning) {
    message =
      '对污点的更改将立即取消调度在此节点上运行但没有相应容忍度的应用程序。您要继续吗？';
  } else if (!taintsWarning && labelsWarning) {
    message =
      '删除或更改正在使用的标签可能会阻止应用程序将来在此节点上调度。您要继续吗？';
  } else if (taintsWarning && labelsWarning) {
    message = (
      <>
        <p>
          Changes to taints will immediately deschedule applications running on
          this node without the corresponding tolerations.
        </p>
        <p>
          Removing or changing a label that is used might prevent applications
          from scheduling on this node in the future.
        </p>
        <p>您要继续吗？</p>
      </>
    );
  } else if (cordonWarning) {
    message =
      '将此节点标记为不可调度将有效隔离该节点，并阻止任何新工作负载在该节点上调度。您确定吗？';
  } else if (drainWarning) {
    message =
      '排空此节点将导致所有工作负载从该节点中驱逐。这可能会导致某些服务中断。您确定吗？';
  }

  return confirm({
    title: 'Are you sure?',
    modalType: ModalType.Warn,
    message,
    confirmButton: buildConfirmButton('Update', 'primary'),
  });
}
