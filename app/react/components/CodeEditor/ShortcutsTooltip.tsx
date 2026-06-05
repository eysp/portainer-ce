import { BROWSER_OS_PLATFORM } from '@/react/constants';

import { Tooltip } from '@@/Tip/Tooltip';

const otherEditorConfig = {
  tooltip: (
    <>
      <div>Ctrl+F - 开始搜索</div>
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
  searchCmdLabel: 'Ctrl+F 进行搜索',
} as const;

export const editorConfig = {
  mac: {
    tooltip: (
      <>
        <div>Cmd+F - 开始搜索</div>
        <div>Cmd+G - 查找下一个</div>
        <div>Cmd+Shift+G - 查找上一个</div>
        <div>Cmd+Option+F - 替换</div>
        <div>Cmd+Option+R - 全部替换</div>
        <div>Option+G - 跳转到行</div>
        <div>持久搜索：</div>
        <div className="ml-5">Enter - 查找下一个</div>
        <div className="ml-5">Shift+Enter - 查找上一个</div>
      </>
    ),
    searchCmdLabel: 'Cmd+F 进行搜索',
  },

  lin: otherEditorConfig,
  win: otherEditorConfig,
} as const;

export function ShortcutsTooltip() {
  return (
    <div className="text-muted small vertical-center ml-auto">
      {editorConfig[BROWSER_OS_PLATFORM].searchCmdLabel}

      <Tooltip message={editorConfig[BROWSER_OS_PLATFORM].tooltip} />
    </div>
  );
}
