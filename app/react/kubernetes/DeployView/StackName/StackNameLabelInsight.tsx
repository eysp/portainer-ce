import { useCurrentUser } from '@/react/hooks/useUser';

import { InsightsBox } from '@@/InsightsBox';
import { Link } from '@@/Link';

export function StackNameLabelInsight() {
  const { isPureAdmin } = useCurrentUser();
  const insightsBoxContent = (
    <>
      下方的堆栈字段之前被标记为&apos;名称&apos;，但实际上，它一直是堆栈名称（因此进行了重新标记）。
      {isPureAdmin && (
        <>
          <br />
          Kubernetes 堆栈功能可以通过{' '}
          <Link to="portainer.settings" target="_blank">
            Kubernetes 设置
          </Link>
          完全关闭。
        </>
      )}
    </>
  );

  return (
    <InsightsBox
      type="slim"
      header="堆栈"
      content={insightsBoxContent}
      insightCloseId="k8s-stacks-name"
    />
  );
}
