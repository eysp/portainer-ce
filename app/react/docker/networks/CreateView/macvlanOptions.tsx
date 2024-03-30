import { Share2, Sliders } from 'lucide-react';

import { BoxSelectorOption } from '@@/BoxSelector';

export function getOptions(
  hasNetworks: boolean
): ReadonlyArray<BoxSelectorOption<string>> {
  return [
    {
      id: 'network_config',
      icon: Sliders,
      iconType: 'badge',
      label: '配置',
      description: '我想在部署之前配置网络',
      value: 'local',
    },
    {
      id: 'network_deploy',
      icon: Share2,
      iconType: 'badge',
      label: '创建',
      description: '我想根据配置创建网络',
      value: 'swarm',
      disabled: () => !hasNetworks,
    },
  ] as const;
}
