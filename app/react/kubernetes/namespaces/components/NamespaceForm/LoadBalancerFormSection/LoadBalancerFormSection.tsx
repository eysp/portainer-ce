import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';

export function LoadBalancerFormSection() {
  return (
    <FormSection title="负载均衡器">
      <TextTip color="blue">
        您可以在此命名空间内设置可创建的外部负载均衡器数量的配额。
        将此配额设置为 0 可有效地禁用此命名空间中负载均衡器的使用。
      </TextTip>
      <SwitchField
        data-cy="k8sNamespaceCreate-loadBalancerQuotaToggle"
        label="负载均衡器配额"
        labelClass="col-sm-3 col-lg-2"
        fieldClass="pt-2"
        checked={false}
        featureId={FeatureId.K8S_RESOURCE_POOL_LB_QUOTA}
        onChange={() => {}}
      />
    </FormSection>
  );
}
