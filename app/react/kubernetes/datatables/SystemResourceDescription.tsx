import { Authorized } from '@/react/hooks/useUser';

import { TextTip } from '@@/Tip/TextTip';

interface Props {
  showSystemResources?: boolean;
}

export function SystemResourceDescription({ showSystemResources }: Props) {
  return showSystemResources === false ? (
    <Authorized authorizations="K8sAccessSystemNamespaces" adminOnlyCE>
      <TextTip color="blue" className="!mb-0">
        系统资源已隐藏，可以在表格设置中更改
      </TextTip>
    </Authorized>
  ) : null;
}
