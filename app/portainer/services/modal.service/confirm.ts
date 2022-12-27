import sanitize from 'sanitize-html';
import bootbox from 'bootbox';

import {
  applyBoxCSS,
  ButtonsOptions,
  confirmButtons,
  buildTitle,
  ModalTypeIcon,
} from './utils';

type ConfirmCallback = (confirmed: boolean) => void;

interface ConfirmAsyncOptions {
  title: string;
  message: string;
  buttons: ButtonsOptions;
}

interface ConfirmOptions extends ConfirmAsyncOptions {
  callback: ConfirmCallback;
}

export function confirmWebEditorDiscard() {
  const options = {
    title: buildTitle('你确定吗？'),
    message:
      '你目前在编辑器中有未保存的修改。你确定你要离开吗？',
    buttons: {
      confirm: {
        label: '是的',
        className: 'btn-danger',
      },
    },
  };
  return new Promise((resolve) => {
    confirm({
      ...options,
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirmAsync(options: ConfirmAsyncOptions) {
  return new Promise((resolve) => {
    confirm({
      ...options,
      title: buildTitle(options.title),
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirmDestructiveAsync(options: ConfirmAsyncOptions) {
  return new Promise((resolve) => {
    confirm({
      ...options,
      title: buildTitle(options.title, ModalTypeIcon.Destructive),
      callback: (confirmed) => resolve(confirmed),
    });
  });
}

export function confirm(options: ConfirmOptions) {
  const box = bootbox.confirm({
    title: options.title,
    message: options.message,
    buttons: confirmButtons(options.buttons),
    callback: options.callback,
  });

  applyBoxCSS(box);
}

export function confirmWarn(options: ConfirmOptions) {
  confirm({ ...options, title: buildTitle(options.title, ModalTypeIcon.Warn) });
}

export function confirmDestructive(options: ConfirmOptions) {
  confirm({
    ...options,
    title: buildTitle(options.title, ModalTypeIcon.Destructive),
  });
}

export function confirmImageForceRemoval(callback: ConfirmCallback) {
  confirm({
    title: buildTitle('你确定吗？', ModalTypeIcon.Destructive),
    message:
      '强制删除镜像将删除该镜像，即使它有多个标签，或者它被停止的容器使用。',
    buttons: {
      confirm: {
        label: '移除镜像',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function cancelRegistryRepositoryAction(callback: ConfirmCallback) {
  confirm({
    title: buildTitle('你确定吗？', ModalTypeIcon.Destructive),
    message:
      '警告：在此操作完成之前中断，将导致所有标签丢失。你确定你要这样做吗？',
    buttons: {
      confirm: {
        label: '停止',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmDeletion(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);
  confirm({
    title: buildTitle('你确定吗？', ModalTypeIcon.Destructive),
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '删除',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmWithTitle(
  title: string,
  message: string,
  callback: ConfirmCallback
) {
  const messageSanitized = sanitize(message);
  confirm({
    title: buildTitle(title, ModalTypeIcon.Destructive),
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '删除',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmDetachment(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);
  confirm({
    title: buildTitle('你确定吗？'),
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '断开',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmDisassociate(callback: ConfirmCallback) {
  const message =
    '<p>解除这个边缘环境的关联将把它标记为非关联，并将清除注册的边缘ID。</p>' +
    '<p>任何用与此环境相关的Edge密钥启动的代理将能够与此环境重新关联。</p>' +
    '<p>你可以重新使用你用来部署现有Edge代理的Edge ID和Edge密钥，将一个新的Edge设备关联到这个环境。</p>';
  confirm({
    title: buildTitle('关于取消关联'),
    message: sanitize(message),
    buttons: {
      confirm: {
        label: 'Disassociate',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmUpdate(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: buildTitle('你确定吗？'),
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '更新',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmRedeploy(message: string, callback: ConfirmCallback) {
  const messageSanitized = sanitize(message);

  confirm({
    title: '',
    message: messageSanitized,
    buttons: {
      confirm: {
        label: '重新部署应用程序',
        className: 'btn-primary',
      },
      cancel: {
        label: "我稍后再做",
      },
    },
    callback,
  });
}

export function confirmDeletionAsync(message: string) {
  return new Promise((resolve) => {
    confirmDeletion(message, (confirmed) => resolve(confirmed));
  });
}

export function confirmImageExport(callback: ConfirmCallback) {
  confirm({
    title: buildTitle('警告'),
    message:
      '导出可能需要数分钟，在导出过程中不要浏览。',
    buttons: {
      confirm: {
        label: '继续',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function confirmChangePassword() {
  return confirmAsync({
    title: buildTitle('你确定吗？'),
    message:
      '更改密码后，你将被注销。你想改变你的密码吗？',
    buttons: {
      confirm: {
        label: '更改',
        className: 'btn-primary',
      },
    },
  });
}

export function confirmForceChangePassword() {
  const box = bootbox.dialog({
    message:
      '请将您的密码更新为更强的密码，以便继续使用Portainer。',
    buttons: {
      confirm: {
        label: 'OK',
        className: 'btn-primary',
      },
    },
  });

  applyBoxCSS(box);
}
