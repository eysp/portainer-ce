import { getEnvironmentTypeIcon } from '@/react/portainer/environments/utils';
import dockerEdge from '@/assets/ico/docker-edge-environment.svg';
import podmanEdge from '@/assets/ico/podman-edge-environment.svg';
import kube from '@/assets/images/kubernetes_endpoint.png';
import kubeEdge from '@/assets/ico/kubernetes-edge-environment.svg';
import {
  ContainerEngine,
  EnvironmentType,
} from '@/react/portainer/environments/types';
import azure from '@/assets/ico/vendor/azure.svg';
import docker from '@/assets/ico/vendor/docker.svg';
import podman from '@/assets/ico/vendor/podman.svg';

import { Icon } from '@@/Icon';

interface Props {
  type: EnvironmentType;
  containerEngine?: ContainerEngine;
}

export function EnvironmentIcon({ type, containerEngine }: Props) {
  switch (type) {
    case EnvironmentType.AgentOnDocker:
    case EnvironmentType.Docker:
      if (containerEngine === ContainerEngine.Podman) {
        return (
          <img
            src={podman}
            width="60"
            alt="Podman 环境"
            aria-hidden="true"
          />
        );
      }
      return (
        <img
          src={docker}
          width="60"
          alt="Docker 环境"
          aria-hidden="true"
        />
      );
    case EnvironmentType.Azure:
      return (
        <img
          src={azure}
          width="60"
          alt="Azure 环境"
          aria-hidden="true"
        />
      );
    case EnvironmentType.EdgeAgentOnDocker:
      if (containerEngine === ContainerEngine.Podman) {
        return (
          <img
            src={podmanEdge}
            alt="Podman Edge 环境"
            aria-hidden="true"
          />
        );
      }
      return (
        <img
          src={dockerEdge}
          alt="Docker Edge 环境"
          aria-hidden="true"
        />
      );
    case EnvironmentType.KubernetesLocal:
    case EnvironmentType.AgentOnKubernetes:
      return <img src={kube} alt="Kubernetes 环境" aria-hidden="true" />;
    case EnvironmentType.EdgeAgentOnKubernetes:
      return (
        <img
          src={kubeEdge}
          alt="Kubernetes Edge 环境"
          aria-hidden="true"
        />
      );
    default:
      return (
        <Icon
          icon={getEnvironmentTypeIcon(type, containerEngine)}
          className="blue-icon !h-16 !w-16"
        />
      );
  }
}
