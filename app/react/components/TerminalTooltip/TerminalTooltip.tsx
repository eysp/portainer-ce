import { BROWSER_OS_PLATFORM } from '@/react/constants';

import { Tooltip } from '@@/Tip/Tooltip';

const editorConfig = {
  mac: {
    tooltip: (
      <>
        <div>在控制台中：</div>
        <div>Cmd+C - 复制</div>
        <div>Cmd+V - 粘贴</div>
        <div>或右键点击 -&gt; 复制/粘贴</div>
      </>
    ),
  },

  lin: {
    tooltip: (
      <>
        <div>在控制台中：</div>
        <div>Ctrl+Insert - 复制</div>
        <div>Shift+Insert - 粘贴</div>
        <div>或右键点击 -&gt; 复制/粘贴</div>
      </>
    ),
  },

  win: {
    tooltip: (
      <>
        <div>在控制台中：</div>
        <div>Ctrl+Insert - 复制</div>
        <div>Shift+Insert - 粘贴</div>
        <div>或右键点击 -&gt; 复制/粘贴</div>
      </>
    ),
  },
} as const;

export function TerminalTooltip() {
  return <Tooltip message={editorConfig[BROWSER_OS_PLATFORM].tooltip} />;
}
