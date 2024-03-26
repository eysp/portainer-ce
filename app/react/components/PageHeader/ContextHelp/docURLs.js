const docURLs = [
  {
    desc: '首页',
    docURL: 'https://docs.portainer.io/user/home',
    locationRegex: /#!\/home/,
    examples: ['#!/home'],
  },
  {
    desc: 'Docker或Swarm / 仪表盘',
    docURL: 'https://docs.portainer.io/user/docker/dashboard',
    locationRegex: /#!\/\d+\/docker\/dashboard/,
    examples: ['#!/10/docker/dashboard'],
  },
  {
    desc: 'Docker或Swarm / 自定义模板',
    docURL: 'https://docs.portainer.io/user/docker/templates/custom',
    locationRegex: /#!\/\d+\/docker\/templates\/custom/,
    examples: ['#!/10/docker/templates/custom', '#!/10/docker/templates/custom/new?fileContent=&type=', '#!/10/docker/templates/custom/1'],
  },
  {
    desc: 'Docker或Swarm / 应用模板',
    docURL: 'https://docs.portainer.io/user/docker/templates',
    locationRegex: /#!\/\d+\/docker\/templates/,
    examples: ['#!/10/docker/templates'],
  },
  {
    desc: 'Docker或Swarm / 栈',
    docURL: 'https://docs.portainer.io/user/docker/stacks',
    locationRegex: /#!\/\d+\/docker\/stacks/,
    examples: ['#!/10/docker/stacks', '#!/10/docker/stacks/newstack', '#!/10/docker/stacks/s4?id=3&type=1&regular=true&external=false&orphaned=false'],
  },
  {
    desc: 'Swarm / 服务',
    docURL: 'https://docs.portainer.io/user/docker/services',
    locationRegex: /#!\/\d+\/docker\/(services|tasks)/,
    examples: [
      '#!/10/docker/services',
      '#!/10/docker/services/zqp46vzoz5nnf39m6c518nlt8',
      '#!/10/docker/services/zqp46vzoz5nnf39m6c518nlt8/logs',
      '#!/10/docker/tasks/yyll0peo7ack4uaw2wom3nxso',
      '#!/10/docker/tasks/yyll0peo7ack4uaw2wom3nxso/logs',
    ],
  },
  {
    desc: 'Docker或Swarm / 容器',
    docURL: 'https://docs.portainer.io/user/docker/containers',
    locationRegex: /#!\/\d+\/docker\/containers/,
    examples: [
      '#!/10/docker/containers',
      '#!/10/docker/containers/new',
      '#!/10/docker/containers/new?from=49ff4ae03d10c57fe375f6968c48a6169a9852a6bfbb5137cd30c615d58188c1',
      '#!/10/docker/containers/49ff4ae03d10c57fe375f6968c48a6169a9852a6bfbb5137cd30c615d58188c1',
      '#!/10/docker/containers/49ff4ae03d10c57fe375f6968c48a6169a9852a6bfbb5137cd30c615d58188c1/logs',
      '#!/10/docker/containers/49ff4ae03d10c57fe375f6968c48a6169a9852a6bfbb5137cd30c615d58188c1/inspect',
      '#!/10/docker/containers/49ff4ae03d10c57fe375f6968c48a6169a9852a6bfbb5137cd30c615d58188c1/stats',
    ],
  },
  {
    desc: 'Docker或Swarm / 镜像',
    docURL: 'https://docs.portainer.io/user/docker/images',
    locationRegex: /#!\/\d+\/docker\/images/,
    examples: ['#!/10/docker/images', '#!/10/docker/images/build', '#!/10/docker/images/sha256:feb5d9fea6a5e9606aa995e879d862b825965ba48de054caab5ef356dc6b3412'],
  },
  {
    desc: 'Docker或Swarm / 网络',
    docURL: 'https://docs.portainer.io/user/docker/networks',
    locationRegex: /#!\/\d+\/docker\/networks/,
    examples: ['#!/10/docker/networks', '#!/10/docker/networks/new', '#!/10/docker/networks/db5732ff4a2c6df70a18530dba6abd8625f8e94c5fc5daabbcbab07377ee1044'],
  },
  {
    desc: 'Docker或Swarm / 存储卷',
    docURL: 'https://docs.portainer.io/user/docker/volumes',
    locationRegex: /#!\/\d+\/docker\/volumes/,
    examples: ['#!/10/docker/volumes', '#!/10/docker/volumes/new', '#!/10/docker/volumes/153b46162f5bab9a7c9d2c8e1675115fcedd4c0ccdf5834159400750fa6b794c'],
  },
  {
    desc: 'Swarm / 配置',
    docURL: 'https://docs.portainer.io/user/docker/configs',
    locationRegex: /#!\/\d+\/docker\/configs/,
    examples: ['#!/10/docker/configs', '#!/10/docker/configs/new', '#!/10/docker/configs/azd0xc805l298jrgnadbnnzyv'],
  },
  {
    desc: 'Swarm / 秘密',
    docURL: 'https://docs.portainer.io/user/docker/secrets',
    locationRegex: /#!\/\d+\/docker\/secrets/,
    examples: ['#!/10/docker/secrets', '#!/10/docker/secrets/new', '#!/10/docker/secrets/tsoeeh7ln7g54g5qkk67eg4xe'],
  },
  {
    desc: 'Docker或Swarm / Swarm / 集群可视化',
    docURL: 'https://docs.portainer.io/user/docker/swarm/cluster-visualizer',
    locationRegex: /#!\/\d+\/docker\/swarm\/visualizer/,
    examples: ['#!/10/docker/swarm/visualizer'],
  },
  {
    desc: 'Docker或Swarm / Swarm / 设置',
    docURL: 'https://docs.portainer.io/user/docker/swarm/setup',
    locationRegex: /#!\/\d+\/docker\/swarm\/feat-config/,
    examples: ['#!/10/docker/feat-config'],
  },
  {
    desc: 'Swarm / Swarm / 注册表',
    docURL: 'https://docs.portainer.io/user/docker/swarm/registries',
    locationRegex: /#!\/\d+\/docker\/swarm\/registries/,
    examples: ['#!/10/docker/registries'],
  },
  {
    desc: 'Swarm / Swarm',
    docURL: 'https://docs.portainer.io/user/docker/swarm',
    locationRegex: /#!\/\d+\/docker\/(swarm|nodes)/,
    examples: ['#!/10/docker/swarm', '#!/10/docker/nodes/nd694yepzgms1j8y7kv3lpcc3'],
  },
  {
    desc: 'Docker / 事件',
    docURL: 'https://docs.portainer.io/user/docker/events',
    locationRegex: /#!\/\d+\/docker\/events/,
    examples: ['#!/10/docker/events'],
  },
  {
    desc: 'Docker / 主机 / 注册表',
    docURL: 'https://docs.portainer.io/user/docker/host/registries',
    locationRegex: /#!\/\d+\/docker\/host\/registries/,
    examples: ['#!/10/docker/registries'],
  },
  {
    desc: 'Docker / 主机 / 设置',
    docURL: 'https://docs.portainer.io/user/docker/host/setup',
    locationRegex: /#!\/\d+\/docker\/host\/feat-config/,
    examples: ['#!/10/docker/feat-config'],
  },
  {
    desc: 'Docker / 主机',
    docURL: 'https://docs.portainer.io/user/docker/host',
    locationRegex: /#!\/\d+\/docker\/host/,
    examples: ['#!/10/docker/host'],
  },
  {
    desc: 'Kubernetes / 仪表盘',
    docURL: 'https://docs.portainer.io/user/kubernetes/dashboard',
    locationRegex: /#!\/\d+\/kubernetes\/dashboard/,
    examples: ['#!/1/kubernetes/dashboard'],
  },
  {
    desc: 'Kubernetes / 自定义模板',
    docURL: 'https://docs.portainer.io/user/kubernetes/templates',
    locationRegex: /#!\/\d+\/kubernetes\/templates\/custom/,
    examples: ['#!/1/kubernetes/templates/custom', '#!/1/kubernetes/templates/custom/new?fileContent='],
  },
  {
    desc: 'Kubernetes / 命名空间',
    docURL: 'https://docs.portainer.io/user/kubernetes/namespaces',
    locationRegex: /#!\/\d+\/kubernetes\/pools/,
    examples: ['#!/1/kubernetes/pools', '#!/1/kubernetes/pools/new', '#!/1/kubernetes/deploy?templateId=', '#!/1/kubernetes/pools/default'],
  },
  {
    desc: 'Kubernetes / Helm',
    docURL: 'https://docs.portainer.io/user/kubernetes/helm',
    locationRegex: /#!\/\d+\/kubernetes\/templates\/helm/,
    examples: ['#!/1/kubernetes/templates/helm'],
  },
  {
    desc: 'Kubernetes / 应用',
    docURL: 'https://docs.portainer.io/user/kubernetes/applications',
    locationRegex: /#!\/\d+\/kubernetes\/applications/,
    examples: ['#!/1/kubernetes/applications', '#!/1/kubernetes/applications/new', '#!/1/kubernetes/deploy?templateId=', '#!/1/kubernetes/applications/metallb-system/controller'],
  },
  {
    desc: 'Kubernetes / 服务',
    docURL: 'https://docs.portainer.io/user/kubernetes/services',
    locationRegex: /#!\/\d+\/kubernetes\/services/,
    examples: ['#!/1/kubernetes/services'],
  },
  {
    desc: 'Kubernetes / Ingress',
    docURL: 'https://docs.portainer.io/user/kubernetes/ingresses',
    locationRegex: /#!\/\d+\/kubernetes\/ingresses/,
    examples: ['#!/1/kubernetes/ingresses'],
  },
  {
    desc: 'Kubernetes / 配置和密钥',
    docURL: 'https://docs.portainer.io/user/kubernetes/configurations',
    locationRegex: /#!\/\d+\/kubernetes\/configurations/,
    examples: ['#!/1/kubernetes/configurations', '#!/1/kubernetes/configurations/new', '#!/1/kubernetes/configurations/metallb-system/config'],
  },
  {
    desc: 'Kubernetes / 存储卷',
    docURL: 'https://docs.portainer.io/user/kubernetes/volumes',
    locationRegex: /#!\/\d+\/kubernetes\/volumes/,
    examples: ['#!/1/kubernetes/volumes'],
  },
  {
    desc: 'Kubernetes / 集群设置',
    docURL: 'https://docs.portainer.io/user/kubernetes/cluster/setup',
    locationRegex: /#!\/\d+\/kubernetes\/cluster\/configure/,
    examples: ['#!/1/kubernetes/cluster/configure'],
  },
  {
    desc: 'Kubernetes / 集群安全限制',
    docURL: 'https://docs.portainer.io/user/kubernetes/cluster/security',
    locationRegex: /#!\/\d+\/kubernetes\/cluster\/securityConstraint/,
    examples: ['#!/1/kubernetes/cluster/securityConstraint'],
  },
  {
    desc: 'Kubernetes / 集群',
    docURL: 'https://docs.portainer.io/user/kubernetes/cluster',
    locationRegex: /#!\/\d+\/kubernetes\/cluster/,
    examples: ['#!/1/kubernetes/cluster', '#!/1/kubernetes/cluster/ip-10-138-11-102', '#!/1/kubernetes/cluster/ip-10-138-11-102/stats'],
  },
  {
    desc: 'Kubernetes / 集群 / 注册表',
    docURL: 'https://docs.portainer.io/user/kubernetes/cluster/registries',
    locationRegex: /#!\/\d+\/kubernetes\/registries/,
    examples: ['#!/1/kubernetes/registries'],
  },
  {
    desc: 'Azure ACI / 仪表盘',
    docURL: 'https://docs.portainer.io/user/aci/dashboard',
    locationRegex: /#!\/\d+\/azure\/dashboard/,
    examples: ['#!/26/azure/dashboard'],
  },
  {
    desc: 'Azure ACI / 容器实例',
    docURL: 'https://docs.portainer.io/user/aci/containers',
    locationRegex: /#!\/\d+\/azure\/containerinstances/,
    examples: ['#!/26/azure/containerinstances'],
  },
  {
    desc: '边缘计算 / 边缘设备',
    docURL: 'https://docs.portainer.io/user/edge/devices',
    locationRegex: /#!\/edge\/devices/,
    examples: ['#!/edge/devices', '#!/edge/devices/waiting-room'],
  },
  {
    desc: '边缘计算 / 边缘组',
    docURL: 'https://docs.portainer.io/user/edge/groups',
    locationRegex: /#!\/edge\/groups/,
    examples: ['#!/edge/groups', '#!/edge/groups/new'],
  },
  {
    desc: '边缘计算 / 边缘堆栈',
    docURL: 'https://docs.portainer.io/user/edge/stacks',
    locationRegex: /#!\/edge\/stacks/,
    examples: ['#!/edge/stacks', '#!/edge/stacks/new'],
  },
  {
    desc: '边缘计算 / 边缘作业',
    docURL: 'https://docs.portainer.io/user/edge/jobs',
    locationRegex: /#!\/edge\/jobs/,
    examples: ['#!/edge/jobs', '#!/edge/jobs/new'],
  },
  {
    desc: '边缘计算 / 边缘配置',
    docURL: 'https://docs.portainer.io/user/edge/configurations',
    locationRegex: /#!\/edge\/configurations/,
    examples: ['#!/edge/configurations', '#!/edge/configurations/new'],
  },
  {
    desc: 'Nomad / 仪表盘',
    docURL: 'https://docs.portainer.io/user/nomad/dashboard',
    locationRegex: /#!\/\d+\/nomad\/dashboard/,
    examples: ['#!/2/nomad/dashboard'],
  },
  {
    desc: 'Nomad / Nomad 作业',
    docURL: 'https://docs.portainer.io/user/nomad/jobs',
    locationRegex: /#!\/\d+\/nomad\/jobs/,
    examples: [
      '#!/2/nomad/jobs',
      '#!/2/nomad/jobs/portainer-agent/tasks/portainer-agent/allocations/acdbf08e-34af-9b8a-cc84-7dc202bf1fcf/events?namespace=default',
      '#!/2/nomad/jobs/portainer-agent/tasks/portainer-agent/allocations/acdbf08e-34af-9b8a-cc84-7dc202bf1fcf/logs?namespace=default',
    ],
  },
  {
    desc: '帐户设置',
    docURL: 'https://docs.portainer.io/user/account-settings',
    locationRegex: /#!\/account/,
    examples: ['#!/account', '#!/account/tokens/new'],
  },
  {
    desc: '设置 / 用户',
    docURL: 'https://docs.portainer.io/admin/users',
    locationRegex: /#!\/users/,
    examples: ['#!/users', '#!/users/1'],
  },
  {
    desc: '设置 / 用户 / 团队',
    docURL: 'https://docs.portainer.io/admin/users/teams',
    locationRegex: /#!\/teams/,
    examples: ['#!/teams', '#!/teams/1'],
  },
  {
    desc: '设置 / 用户 / 角色',
    docURL: 'https://docs.portainer.io/admin/users/roles',
    locationRegex: /#!\/roles/,
    examples: ['#!/roles'],
  },
  {
    desc: '设置 / 环境',
    docURL: 'https://docs.portainer.io/admin/environments',
    locationRegex: /#!\/endpoints/,
    examples: ['#!/endpoints', '#!/endpoints/10', '#!/endpoints/10/access'],
  },
  {
    desc: '设置 / 环境 / 群组',
    docURL: 'https://docs.portainer.io/admin/environments/groups',
    locationRegex: /#!\/groups/,
    examples: ['#!/groups', '#!/groups/new', '#!/groups/3', '#!/groups/3/access'],
  },
  {
    desc: '设置 / 环境 / 标签',
    docURL: 'https://docs.portainer.io/admin/environments/tags',
    locationRegex: /#!\/tags/,
    examples: ['#!/tags'],
  },
  {
    desc: '设置 / 注册表',
    docURL: 'https://docs.portainer.io/admin/registries',
    locationRegex: /#!\/registries/,
    examples: [
      '#!/registries',
      '#!/registries/new',
      '#!/registries/1',
      '#!/registries/1/repositories',
      '#!/registries/1/configure',
      '#!/registries/5/portainer.demo~2Fportainerregistrytesting~2Falpine',
      '#!/registries/5/portainer.demo~2Fportainerregistrytesting~2Falpine/jfadelhaye',
    ],
  },
  {
    desc: '设置 / 许可证',
    docURL: 'https://docs.portainer.io/admin/licenses',
    locationRegex: /#!\/licenses/,
    examples: ['#!/licenses', '#!/licenses/licenses/new'],
  },
  {
    desc: '设置 / 身份验证日志',
    docURL: 'https://docs.portainer.io/admin/logs',
    locationRegex: /#!\/auth-logs/,
    examples: ['#!/auth-logs'],
  },
  {
    desc: '设置 / 身份验证日志 / 活动日志',
    docURL: 'https://docs.portainer.io/admin/logs/activity',
    locationRegex: /#!\/activity-logs/,
    examples: ['#!/activity-logs'],
  },
  {
    desc: '设置 / 设置 / 身份验证',
    docURL: 'https://docs.portainer.io/admin/settings/authentication',
    locationRegex: /#!\/settings\/auth/,
    examples: ['#!/settings/auth'],
  },
  {
    desc: '设置/设置/通知',
    docURL: 'https://docs.portainer.io/admin/notifications',
    locationRegex: /#!\/notifications/,
    examples: ['#!/notifications'],
  },
  {
    desc: '设置 / 设置 / 云设置',
    docURL: 'https://docs.portainer.io/admin/settings/cloud',
    locationRegex: /#!\/settings\/cloud/,
    examples: ['#!/settings/cloud', '#!/settings/cloud/credentials/new', '#!/settings/cloud/credentials/1'],
  },
  {
    desc: '设置 / 设置 / 边缘计算',
    docURL: 'https://docs.portainer.io/admin/settings/edge',
    locationRegex: /#!\/settings\/edge/,
    examples: ['#!/settings/edge'],
  },
  {
    desc: '设置 / 设置',
    docURL: 'https://docs.portainer.io/admin/settings',
    locationRegex: /#!\/settings/,
    examples: ['#!/settings'],
  },
];

const DEFAULT_DOC_URL = 'https://docs.portainer.io';

export function getDocURL() {
  const hash = window.location.hash;
  for (let i = 0; i < docURLs.length; i += 1) {
    const docURL = docURLs[i];
    if (hash.match(docURL.locationRegex)) {
      return docURL.docURL;
    }
  }
  return DEFAULT_DOC_URL;
}
