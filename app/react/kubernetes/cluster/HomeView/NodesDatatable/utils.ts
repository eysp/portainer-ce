import { Node } from 'kubernetes-types/core/v1';

export function getInternalNodeIpAddress(node?: Node) {
  return node?.status?.addresses?.find(
    (address) => address.type === 'InternalIP'
  )?.address;
}

const controlPlaneLabels = [
  'node-role.kubernetes.io/control-plane',
  'node-role.kubernetes.io/master',
  'node.kubernetes.io/microk8s-controlplane',
];

const roleLabels = ['kubernetes.io/role', 'node.kubernetes.io/role'];

export function getRole(node: Node): 'Control plane' | 'Worker' {
  const hasControlPlaneLabel = controlPlaneLabels.some(
    (label) => node.metadata?.labels?.[label] !== undefined
  );

  const hasControlPlaneLabelValue = roleLabels.some(
    (label) =>
      node.metadata?.labels?.[label] === 'control-plane' ||
      node.metadata?.labels?.[label] === 'master'
  );

  return hasControlPlaneLabel || hasControlPlaneLabelValue
    ? 'Control plane'
    : 'Worker';
}
