import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { dockerFile } from '@codemirror/legacy-modes/mode/dockerfile';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { useCallback, useMemo, useState } from 'react';
import { createTheme } from '@uiw/codemirror-themes';
import { tags as highlightTags } from '@lezer/highlight';

import { AutomationTestingProps } from '@/types';

import { CopyButton } from '@@/buttons/CopyButton';

import { useDebounce } from '../hooks/useDebounce';

import styles from './CodeEditor.module.css';
import { TextTip } from './Tip/TextTip';
import { StackVersionSelector } from './StackVersionSelector';

type Type = 'yaml' | 'shell' | 'dockerfile';
interface Props extends AutomationTestingProps {
  id: string;
  placeholder?: string;
  type?: Type;
  readonly?: boolean;
  onChange: (value: string) => void;
  value: string;
  height?: string;
  versions?: number[];
  onVersionChange?: (version: number) => void;
}

const theme = createTheme({
  theme: 'light',
  settings: {
    background: 'var(--bg-codemirror-color)',
    foreground: 'var(--text-codemirror-color)',
    caret: 'var(--border-codemirror-cursor-color)',
    selection: 'var(--bg-codemirror-selected-color)',
    selectionMatch: 'var(--bg-codemirror-selected-color)',
    gutterBackground: 'var(--bg-codemirror-gutters-color)',
  },
  styles: [
    { tag: highlightTags.atom, color: 'var(--text-cm-default-color)' },
    { tag: highlightTags.meta, color: 'var(--text-cm-meta-color)' },
    {
      tag: [highlightTags.string, highlightTags.special(highlightTags.brace)],
      color: 'var(--text-cm-string-color)',
    },
    { tag: highlightTags.number, color: 'var(--text-cm-number-color)' },
    { tag: highlightTags.keyword, color: 'var(--text-cm-keyword-color)' },
    { tag: highlightTags.comment, color: 'var(--text-cm-comment-color)' },
    {
      tag: highlightTags.variableName,
      color: 'var(--text-cm-variable-name-color)',
    },
  ],
});

const yamlLanguage = new LanguageSupport(StreamLanguage.define(yaml));
const dockerFileLanguage = new LanguageSupport(
  StreamLanguage.define(dockerFile)
);
const shellLanguage = new LanguageSupport(StreamLanguage.define(shell));

const docTypeExtensionMap: Record<Type, LanguageSupport> = {
  yaml: yamlLanguage,
  dockerfile: dockerFileLanguage,
  shell: shellLanguage,
};

export function CodeEditor({
  id,
  onChange,
  placeholder,
  readonly,
  value,
  versions,
  onVersionChange,
  height = '500px',
  type,
  'data-cy': dataCy,
}: Props) {
  const [isRollback, setIsRollback] = useState(false);

  const extensions = useMemo(() => {
    const extensions = [];
    if (type && docTypeExtensionMap[type]) {
      extensions.push(docTypeExtensionMap[type]);
    }
    return extensions;
  }, [type]);

  const handleVersionChange = useCallback(
    (version: number) => {
      if (versions && versions.length > 1) {
        setIsRollback(version < versions[0]);
      }
      onVersionChange?.(version);
    },
    [onVersionChange, versions]
  );

  const [debouncedValue, debouncedOnChange] = useDebounce(value, onChange);

  return (
    <>
      <div className="mb-2 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {!!placeholder && <TextTip color="blue">{placeholder}</TextTip>}
          </div>

          <div className="flex-2 ml-auto mr-2 flex items-center gap-x-2">
            <CopyButton
              data-cy={`copy-code-button-${id}`}
              fadeDelay={2500}
              copyText={value}
              color="link"
              className="!pr-0 !text-sm !font-medium hover:no-underline focus:no-underline"
              indicatorPosition="left"
            >
              Copy to clipboard
            </CopyButton>
          </div>
        </div>
        {versions && (
          <div className="mt-2 flex">
            <div className="ml-auto mr-2">
              <StackVersionSelector
                versions={versions}
                onChange={handleVersionChange}
              />
            </div>
          </div>
        )}
      </div>
      <CodeMirror
        className={styles.root}
        theme={theme}
        value={debouncedValue}
        onChange={debouncedOnChange}
        readOnly={readonly || isRollback}
        id={id}
        extensions={extensions}
        height={height}
        basicSetup={{
          highlightSelectionMatches: false,
          autocompletion: false,
        }}
        data-cy={dataCy}
      />
    </>
  );
}
