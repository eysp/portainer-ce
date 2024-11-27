import { PropsWithChildren, useEffect, useMemo } from 'react';
import { useTransitionHook } from '@uirouter/react';

import { BROWSER_OS_PLATFORM } from '@/react/constants';

import { CodeEditor } from '@@/CodeEditor';
import { Tooltip } from '@@/Tip/Tooltip';

import { FormSectionTitle } from './form-components/FormSectionTitle';
import { FormError } from './form-components/FormError';
import { confirm } from './modals/confirm';
import { ModalType } from './modals';
import { buildConfirmButton } from './modals/utils';

const otherEditorConfig = {
  tooltip: (
    <>
      <div>CtrlF - 开始搜索</div>
      <div>Ctrl+G - 查找下一个</div>
      <div>Ctrl+Shift+G - 查找上一个</div>
      <div>Ctrl+Shift+F - 替换</div>
      <div>Ctrl+Shift+R - 全部替换</div>
      <div>Alt+G - 跳转到行</div>
      <div>持久搜索：</div>
      <div className="ml-5">Enter - 查找下一个</div>
      <div className="ml-5">Shift+Enter - 查找上一个</div>
    </>
  ),
  searchCmdLabel: 'Ctrl+F 开始搜索',
} as const;

export const editorConfig = {
  mac: {
    tooltip: (
      <>
        <div>Cmd+F - 开始搜索</div>
        <div>Cmd+G - 查找下一个</div>
        <div>Cmd+Shift+G - 查找上一个</div>
        <div>Cmd+Option+F - Replace</div>
        <div>Cmd+Option+R - 全部替换</div>
        <div>Option+G - 跳转到行</div>
        <div>持久搜索：</div>
        <div className="ml-5">Enter - 查找下一个</div>
        <div className="ml-5">Shift+Enter - 查找上一个</div>
      </>
    ),
    searchCmdLabel: 'Cmd+F 开始搜索',
  },

  lin: otherEditorConfig,
  win: otherEditorConfig,
} as const;

interface Props {
  value: string;
  onChange: (value: string) => void;

  id: string;
  placeholder?: string;
  yaml?: boolean;
  readonly?: boolean;
  titleContent?: React.ReactNode;
  hideTitle?: boolean;
  error?: string;
  height?: string;
}

export function WebEditorForm({
  id,
  onChange,
  placeholder,
  value,
  titleContent = '',
  hideTitle,
  readonly,
  yaml,
  children,
  error,
  height,
}: PropsWithChildren<Props>) {
  return (
    <div>
      <div className="web-editor overflow-x-hidden">
        {!hideTitle && (
          <>
            <DefaultTitle id={id} />
            {titleContent ?? null}
          </>
        )}
        {children && (
          <div className="form-group text-muted small">
            <div className="col-sm-12 col-lg-12">{children}</div>
          </div>
        )}

        {error && <FormError>{error}</FormError>}

        <div className="form-group">
          <div className="col-sm-12 col-lg-12">
            <CodeEditor
              id={id}
              placeholder={placeholder}
              readonly={readonly}
              yaml={yaml}
              value={value}
              onChange={onChange}
              height={height}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DefaultTitle({ id }: { id: string }) {
  return (
    <FormSectionTitle htmlFor={id}>
      网页编辑器
      <div className="text-muted small vertical-center ml-auto">
        {editorConfig[BROWSER_OS_PLATFORM].searchCmdLabel}

        <Tooltip message={editorConfig[BROWSER_OS_PLATFORM].tooltip} />
      </div>
    </FormSectionTitle>
  );
}

export function usePreventExit(
  initialValue: string,
  value: string,
  check: boolean
) {
  const isChanged = useMemo(
    () => cleanText(initialValue) !== cleanText(value),
    [initialValue, value]
  );

  const preventExit = check && isChanged;

  // when navigating away from the page with unsaved changes, show a portainer prompt to confirm
  useTransitionHook('onBefore', {}, async () => {
    if (!preventExit) {
      return true;
    }
    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: '您确定吗？',
      message:
        '您当前在文本编辑器中有未保存的更改。您确定要离开吗？',
      confirmButton: buildConfirmButton('是的', 'danger'),
    });
    return confirmed;
  });

  // when reloading or exiting the page with unsaved changes, show a browser prompt to confirm
  useEffect(() => {
    function handler(event: BeforeUnloadEvent) {
      if (!preventExit) {
        return undefined;
      }

      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
      return '';
    }

    // if the form is changed, then set the onbeforeunload
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [preventExit]);
}

function cleanText(value: string) {
  return value.replace(/(\r\n|\n|\r)/gm, '');
}
