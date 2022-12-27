function createEventDetails(event) {
  var eventAttr = event.Actor.Attributes;
  var details = '';

  var action = event.Action;
  var extra = '';
  var hasColon = action.indexOf(':');
  if (hasColon != -1) {
    extra = action.substring(hasColon);
    action = action.substring(0, hasColon);
  }

  switch (event.Type) {
    case 'container':
      switch (action) {
        case 'stop':
          details = '容器 ' + eventAttr.name + ' 已停止';
          break;
        case 'destroy':
          details = '容器 ' + eventAttr.name + ' 已删除';
          break;
        case 'create':
          details = '容器 ' + eventAttr.name + ' 已创建';
          break;
        case 'start':
          details = '容器 ' + eventAttr.name + ' 已启动';
          break;
        case 'kill':
          details = '容器 ' + eventAttr.name + ' 已终止';
          break;
        case 'die':
          details = '容器 ' + eventAttr.name + ' 已退出，状态代码为 ' + eventAttr.exitCode;
          break;
        case 'commit':
          details = 'Container ' + eventAttr.name + ' committed';
          break;
        case 'restart':
          details = '容器 ' + eventAttr.name + ' 重新启动';
          break;
        case 'pause':
          details = '容器 ' + eventAttr.name + ' 已暂停';
          break;
        case 'unpause':
          details = '容器 ' + eventAttr.name + ' 已恢复';
          break;
        case 'attach':
          details = 'Container ' + eventAttr.name + ' attached';
          break;
        case 'detach':
          details = 'Container ' + eventAttr.name + ' detached';
          break;
        case 'copy':
          details = '容器 ' + eventAttr.name + ' 已复制';
          break;
        case 'export':
          details = '容器 ' + eventAttr.name + ' 已导出';
          break;
        case 'health_status':
          details = '容器 ' + eventAttr.name + ' 被执行健康检查';
          break;
        case 'oom':
          details = '容器 ' + eventAttr.name + ' 内存不足';
          break;
        case 'rename':
          details = '容器 ' + eventAttr.name + ' 重命名';
          break;
        case 'resize':
          details = '容器 ' + eventAttr.name + ' 重置大小';
          break;
        case 'top':
          details = '显示容器的运行进程 ' + eventAttr.name;
          break;
        case 'update':
          details = '容器 ' + eventAttr.name + ' 已更新';
          break;
        case 'exec_create':
          details = '创建的执行实例';
          break;
        case 'exec_start':
          details = '开始执行实例';
          break;
        case 'exec_die':
          details = '执行实例已退出';
          break;
        default:
          details = '不支持的事件';
      }
      break;
    case 'image':
      switch (action) {
        case 'delete':
          details = 'Image deleted';
          break;
        case 'import':
          details = '镜像 ' + event.Actor.ID + ' 导入';
          break;
        case 'load':
          details = '镜像 ' + event.Actor.ID + ' 加载';
          break;
        case 'tag':
          details = '创建新标记为 ' + eventAttr.name;
          break;
        case 'untag':
          details = 'Image untagged';
          break;
        case 'save':
          details = '镜像 ' + event.Actor.ID + ' 已保存';
          break;
        case 'pull':
          details = '镜像 ' + event.Actor.ID + ' 已拉取';
          break;
        case 'push':
          details = '镜像 ' + event.Actor.ID + ' 已推送';
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    case 'network':
      switch (action) {
        case 'create':
          details = '网络 ' + eventAttr.name + ' 已创建';
          break;
        case 'destroy':
          details = '网络 ' + eventAttr.name + ' 已删除';
          break;
        case 'remove':
          details = '网络 ' + eventAttr.name + ' 重命名';
          break;
        case 'connect':
          details = '容器已连接到 ' + eventAttr.name + ' 网络';
          break;
        case 'disconnect':
          details = '容器已从 ' + eventAttr.name + ' 网络断开连接';
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    case 'volume':
      switch (action) {
        case 'create':
          details = '存储卷 ' + event.Actor.ID + ' 已创建';
          break;
        case 'destroy':
          details = '存储卷 ' + event.Actor.ID + ' 已删除';
          break;
        case 'mount':
          details = '存储卷 ' + event.Actor.ID + ' 已挂载';
          break;
        case 'unmount':
          details = '存储卷 ' + event.Actor.ID + ' 已卸载';
          break;
        default:
          details = 'Unsupported event';
      }
      break;
    default:
      details = 'Unsupported event';
  }
  return details + extra;
}

export function EventViewModel(data) {
  // Type, Action, Actor unavailable in Docker < 1.10
  this.Time = data.time;
  if (data.Type) {
    this.Type = data.Type;
    this.Details = createEventDetails(data);
  } else {
    this.Type = data.status;
    this.Details = data.from;
  }
}
