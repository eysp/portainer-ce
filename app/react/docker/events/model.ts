import { EventMessage } from 'docker-types/generated/1.41';

type EventType = NonNullable<EventMessage['Type']>;
type Action = string;

type Attributes = {
  id: string;
  name: string;
  exitCode: string;
};

type EventToTemplateMap = Record<EventType, ActionToTemplateMap>;
type ActionToTemplateMap = Record<Action, TemplateBuilder>;
type TemplateBuilder = (attr: Attributes) => string;

/**
 * {
 *  [EventType]: {
 *    [Action]: TemplateBuilder,
 *    [Action]: TemplateBuilder
 *  },
 *  [EventType]: {
 *    [Action]: TemplateBuilder,
 *  }
 * }
 *
 * EventType are known and defined by Docker specs
 * Action are unknown and specific for each EventType
 */
const templates: EventToTemplateMap = {
  builder: {},
  config: {},
  container: {
    stop: ({ name }) => `容器 ${name} 已停止`,
    destroy: ({ name }) => `容器 ${name} 已删除`,
    create: ({ name }) => `容器 ${name} 已创建`,
    start: ({ name }) => `容器 ${name} 已启动`,
    kill: ({ name }) => `容器 ${name} 已强制终止`,
    die: ({ name, exitCode }) => `容器 ${name} 以状态码 ${exitCode} 退出`,
    commit: ({ name }) => `容器 ${name} 已提交`,
    restart: ({ name }) => `容器 ${name} 已重启`,
    pause: ({ name }) => `容器 ${name} 已暂停`,
    unpause: ({ name }) => `容器 ${name} 已恢复`,
    attach: ({ name }) => `已连接到容器 ${name}`,
    detach: ({ name }) => `已断开与容器 ${name} 的连接`,
    copy: ({ name }) => `容器 ${name} 已复制`,
    export: ({ name }) => `容器 ${name} 已导出`,
    health_status: ({ name }) => `容器 ${name} 执行了健康检查`,
    oom: ({ name }) => `容器 ${name} 内存溢出`,
    rename: ({ name }) => `容器 ${name} 已重命名`,
    resize: ({ name }) => `容器 ${name} 已调整大小`,
    top: ({ name }) => `已显示容器 ${name} 的运行进程`,
    update: ({ name }) => `容器 ${name} 已更新`,
    exec_create: () => `已创建执行实例`,
    exec_start: () => `执行实例已启动`,
    exec_die: () => `执行实例已退出`,
  },
  daemon: {},
  image: {
    delete: () => `镜像已删除`,
    import: ({ id }) => `镜像 ${id} 已导入`,
    load: ({ id }) => `镜像 ${id} 已加载`,
    tag: ({ name }) => `${name} 创建了新标签`,
    untag: () => `镜像标签已移除`,
    save: ({ id }) => `镜像 ${id} 已保存`,
    pull: ({ id }) => `镜像 ${id} 已拉取`,
    push: ({ id }) => `镜像 ${id} 已推送`,
  },
  network: {
    create: ({ name }) => `网络 ${name} 已创建`,
    destroy: ({ name }) => `网络 ${name} 已删除`,
    remove: ({ name }) => `网络 ${name} 已移除`,
    connect: ({ name }) => `容器已连接到 ${name} 网络`,
    disconnect: ({ name }) => `容器已从 ${name} 网络断开`,
    prune: () => `网络已清理`,
  },
  node: {},
  plugin: {},
  secret: {},
  service: {},
  volume: {
    create: ({ id }) => `数据卷 ${id} 已创建`,
    destroy: ({ id }) => `数据卷 ${id} 已删除`,
    mount: ({ id }) => `数据卷 ${id} 已挂载`,
    unmount: ({ id }) => `数据卷 ${id} 已卸载`,
  },
};

export function createEventDetails(event: EventMessage) {
  const eventType = event.Type ?? '';

  // An action can be `action:extra`
  // For example `docker exec -it CONTAINER sh`
  // Generates the action `exec_create: sh`
  let extra = '';
  let action = event.Action ?? '';
  const hasColon = action?.indexOf(':') ?? -1;
  if (hasColon !== -1) {
    extra = action?.substring(hasColon) ?? '';
    action = action?.substring(0, hasColon);
  }

  const attr: Attributes = {
    id: event.Actor?.ID || '',
    name: event.Actor?.Attributes?.name || '',
    exitCode: event.Actor?.Attributes?.exitCode || '',
  };

  // Event types are defined by the docker API specs
  // Each event has it own set of actions, which a unknown/not defined by specs
  // If the received event or action has no builder associated to it
  // We consider the event unsupported and we provide the raw data
  const detailsBuilder = templates[eventType as EventType]?.[action];
  const details = detailsBuilder
    ? detailsBuilder(attr)
    : `不支持的事件: ${eventType} / ${action}`;

  return details + extra;
}
