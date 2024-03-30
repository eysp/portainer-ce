import { PropsWithChildren } from 'react';

import { BROWSER_OS_PLATFORM } from '@/react/constants';

import { CodeEditor } from '@@/CodeEditor';
import { Tooltip } from '@@/Tip/Tooltip';

import { FormSectionTitle } from './form-components/FormSectionTitle';

const otherEditorConfig = {
  tooltip: (
    <>
      <div>Ctrl+F - 开始搜索</div>
      <div>Ctrl+G - 查找下一个</div>
      <div>Ctrl+Shift+G - 查找上一个</div>
      <div>Ctrl+Shift+F - 替换</div>
      <div>Ctrl+Shift+R - 替换全部</div>
      <div>Alt+G - 跳转到行</div>
      <div>持久搜索:</div>
      <div className="ml-5">Enter - 查找下一个</div>
      <div className="ml-5">Shift+Enter - 查找上一个</div>
    </>
  ),
  searchCmdLabel: 'Ctrl+F 进行搜索',
} as const;

const editorConfig = {
  mac: {
    tooltip: (
      <>
        <div>Cmd+F - 开始搜索</div>
        <div>Cmd+G - 查找下一个</div>
        <div>Cmd+Shift+G - 查找上一个</div>
        <div>Cmd+Option+F - 替换</div>
        <div>Cmd+Option+R - 替换全部</div>
        <div>Option+G - 跳转到行</div>
        <div>持久搜索:</div>
        <div className="ml-5">Enter - 查找下一个</div>
        <div className="ml-5">Shift+Enter - 查找上一个</div>
      </>
    ),
    searchCmdLabel: 'Cmd+F 进行搜索',
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
  hideTitle?: boolean;
  error?: string;
}

export function WebEditorForm({
  id,
  onChange,
  placeholder,
  value,
  hideTitle,
  readonly,
  yaml,
  children,
  error,
}: PropsWithChildren<Props>) {
  return (
    <div>
      <div className="web-editor overflow-x-hidden">
        {!hideTitle && (
          <FormSectionTitle htmlFor={id}>
            Web编辑器
            <div className="text-muted small vertical-center ml-auto">
              {editorConfig[BROWSER_OS_PLATFORM].searchCmdLabel}

              <Tooltip message={editorConfig[BROWSER_OS_PLATFORM].tooltip} />
            </div>
          </FormSectionTitle>
        )}

        {children && (
          <div className="form-group text-muted small">
            <div className="col-sm-12 col-lg-12">{children}</div>
          </div>
        )}

        <div className="form-group">
          <div className="col-sm-12 col-lg-12">
            <CodeEditor
              id={id}
              placeholder={placeholder}
              readonly={readonly}
              yaml={yaml}
              value={value}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-12 col-lg-12">{error}</div>
        </div>
      </div>
    </div>
  );
}
