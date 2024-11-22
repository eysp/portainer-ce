import { useMemo } from 'react';

import { useIsEdgeAdmin } from '@/react/hooks/useUser';

import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';
import { Tooltip } from '@@/Tip/Tooltip';
import { AutocompleteSelect } from '@@/form-components/AutocompleteSelect';
import { FormError } from '@@/form-components/FormError';

type Props = {
  stackName: string;
  setStackName: (name: string) => void;
  stacks?: string[];
  inputClassName?: string;
  textTip?: string;
  error?: string;
};

export function StackName({
  stackName,
  setStackName,
  stacks = [],
  inputClassName,
  textTip = "输入或选择一个‘堆栈’名称以将多个部署组合在一起，或留空以忽略。",
  error = '',
}: Props) {
  const isAdminQuery = useIsEdgeAdmin();
  const stackResults = useMemo(
    () => stacks.filter((stack) => stack.includes(stackName ?? '')),
    [stacks, stackName]
  );

  const { isAdmin } = isAdminQuery;

  const tooltip = (
    <>
  您可以指定一个堆栈名称以标记您想要分组的资源。
  这包括 Deployments、DaemonSets、StatefulSets 和 Pods。
  {isAdmin && (
    <>
      <br />
      您可以将堆栈名称留空，甚至通过{' '}
      <Link to="portainer.settings" target="_blank">
        Kubernetes 设置
      </Link>{' '}
      完全关闭 Kubernetes 堆栈功能。
    </>
  )}
</>
  );

  return (
    <>
      {textTip ? (
        <TextTip className="mb-4" color="blue">
          {textTip}
        </TextTip>
      ) : null}
      <div className="form-group">
        <label
          htmlFor="stack_name"
          className="col-lg-2 col-sm-3 control-label text-left"
        >
          堆栈
          <Tooltip message={tooltip} setHtmlMessage />
        </label>
        <div className={inputClassName || 'col-sm-8'}>
          <AutocompleteSelect
            searchResults={stackResults?.map((result) => ({
              value: result,
              label: result,
            }))}
            value={stackName ?? ''}
            onChange={setStackName}
            placeholder="例如 myStack"
            inputId="stack_name"
          />
          {error ? <FormError>{error}</FormError> : null}
        </div>
      </div>
    </>
  );
}
