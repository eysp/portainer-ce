import sanitize from 'sanitize-html';
import bootbox from 'bootbox';

import {
  applyBoxCSS,
  ButtonsOptions,
  confirmButtons,
  buildTitle,
  ModalTypeIcon,
} from './utils';

type PromptCallback = ((value: string) => void) | ((value: string[]) => void);

interface InputOption {
  text: string;
  value: string;
}

interface PromptOptions {
  title: string;
  message?: string;
  inputType?:
    | 'text'
    | 'textarea'
    | 'email'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'time'
    | 'number'
    | 'password'
    | 'radio'
    | 'range';
  inputOptions: InputOption[];
  buttons: ButtonsOptions;
  value?: string;
  callback: PromptCallback;
}

export async function promptAsync(options: Omit<PromptOptions, 'callback'>) {
  return new Promise((resolve) => {
    prompt({
      ...options,
      callback: (result: string | string[]) => resolve(result),
    });
  });
}

// the ts-ignore is required because the bootbox typings are not up to date
// remove the ts-ignore when the typings are updated in
export function prompt(options: PromptOptions) {
  const box = bootbox.prompt({
    title: options.title,
    inputType: options.inputType,
    inputOptions: options.inputOptions,
    buttons: options.buttons ? confirmButtons(options.buttons) : undefined,
    // casting is done because ts definition expects string=>any, but library code can emit different values, based on inputType
    callback: options.callback as (value: string) => void,
    value: options.value,
  });

  applyBoxCSS(box);

  return box;
}

export function confirmContainerDeletion(
  title: string,
  callback: PromptCallback
) {
  prompt({
    title: buildTitle(title, ModalTypeIcon.Destructive),
    inputType: 'checkbox',
    inputOptions: [
      {
        text: '自动删除非永久性存储卷<i></i>',
        value: '1',
      },
    ],
    buttons: {
      confirm: {
        label: '删除',
        className: 'btn-danger',
      },
    },
    callback,
  });
}

export function confirmUpdateAppIngress(
  title: string,
  message: string,
  inputText: string,
  callback: PromptCallback
) {
  prompt({
    title: buildTitle(title),
    inputType: 'checkbox',
    message,
    inputOptions: [
      {
        text: `${inputText}<i></i>`,
        value: '1',
      },
    ],
    buttons: {
      confirm: {
        label: '更新',
        className: 'btn-primary',
      },
    },
    callback,
  });
}

export function selectRegistry(options: PromptOptions) {
  prompt(options);
}

export function confirmContainerRecreation(
  cannotPullImage: boolean | null,
  callback: PromptCallback
) {
  const box = prompt({
    title: buildTitle('你确定吗？', ModalTypeIcon.Destructive),

    inputType: 'checkbox',
    inputOptions: [
      {
        text: '拉取最新镜像<i></i>',
        value: '1',
      },
    ],
    buttons: {
      confirm: {
        label: '重新创建',
        className: 'btn-danger',
      },
    },
    callback,
  });

  const message = `你要重新创建这个容器，任何不存在的数据都会丢失。这个容器将被删除，另一个容器将使用相同的配置被创建。`;
  box.find('.bootbox-body').prepend(`<p>${message}</p>`);
  const label = box.find('.form-check-label');
  label.css('padding-left', '5px');
  label.css('padding-right', '25px');

  if (cannotPullImage) {
    label.css('cursor', 'not-allowed');
    label.find('i').css('cursor', 'not-allowed');
    const checkbox = box.find('.bootbox-input-checkbox');
    checkbox.prop('disabled', true);
    const formCheck = box.find('.form-check');
    formCheck.prop('style', 'height: 45px;');
    const cannotPullImageMessage = `<div class="fa fa-exclamation-triangle text-warning"/>
               <div class="inline-text text-warning">
                   <span>不能拉取最新的镜像，因为该镜像无法访问--要么它不再存在，要么标签或名称不再正确。
                   </span>
               </div>`;
    formCheck.append(`${cannotPullImageMessage}`);
  }
}

export function confirmServiceForceUpdate(
  message: string,
  callback: PromptCallback
) {
  const sanitizedMessage = sanitize(message);

  const box = prompt({
    title: buildTitle('你确定吗？'),
    inputType: 'checkbox',
    inputOptions: [
      {
        text: '拉取最新镜像版本<i></i>',
        value: '1',
      },
    ],
    buttons: {
      confirm: {
        label: '更新',
        className: 'btn-primary',
      },
    },
    callback,
  });

  customizeCheckboxPrompt(box, sanitizedMessage);
}

export function confirmStackUpdate(
  message: string,
  defaultToggle: boolean,
  confirmButtonClass: string | undefined,
  callback: PromptCallback
) {
  const sanitizedMessage = sanitize(message);

  const box = prompt({
    title: buildTitle('你确定吗？'),
    inputType: 'checkbox',
    inputOptions: [
      {
        text: '重新拉取镜像并重新部署<i></i>',
        value: '1',
      },
    ],
    buttons: {
      confirm: {
        label: '更新',
        className: 'btn-primary',
      },
    },
    callback,
  });

  customizeCheckboxPrompt(box, sanitizedMessage, defaultToggle);
}

function customizeCheckboxPrompt(
  box: JQuery<HTMLElement>,
  message: string,
  toggleCheckbox = false,
  showCheck = false
) {
  box.find('.bootbox-body').prepend(`<p>${message}</p>`);
  const checkbox = box.find('.bootbox-input-checkbox');
  checkbox.prop('checked', toggleCheckbox);

  if (showCheck) {
    checkbox.addClass('visible');
  }
}
