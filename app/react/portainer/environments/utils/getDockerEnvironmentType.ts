export function getDockerEnvironmentType(isSwarm: boolean, isPodman?: boolean) {
  if (isPodman) {
    return 'Podman';
  }
  return isSwarm ? 'Swarm 集群' : '单机';
}
