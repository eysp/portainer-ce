function createEventDetails(event) {
  var eventAttr = event.Actor.Attributes;
  var details = '';
  switch (event.Type) {
    case 'container':
      switch (event.Action) {
        case 'stop':
          details = '容器 ' + eventAttr.name + ' 停止 ';
          break;
        case 'destroy':
          details = '容器 ' + eventAttr.name + ' 删除';
          break;
        case 'create':
          details = '容器 ' + eventAttr.name + ' 创建';
          break;
        case 'start':
          details = '容器 ' + eventAttr.name + ' 开始';
          break;
        case 'kill':
          details = '容器 ' + eventAttr.name + ' 终止';
          break;
        case 'die':
          details = '容器 ' + eventAttr.name + ' 已退出，状态代码为 ' + eventAttr.exitCode;
          break;
        case 'commit':
          details = '容器 ' + eventAttr.name + ' committed';
          break;
        case 'restart':
          details = '容器 ' + eventAttr.name + ' 重启';
          break;
        case 'pause':
          details = '容器 ' + eventAttr.name + ' 暂停';
          break;
        case 'unpause':
          details = '容器 ' + eventAttr.name + ' 未暂停';
          break;
        case 'attach':
          details = '容器 ' + eventAttr.name + ' 附加';
          break;
        case 'detach':
          details = '容器 ' + eventAttr.name + ' 独立';
          break;
        case 'copy':
          details = '容器 ' + eventAttr.name + ' 复制的';
          break;
        case 'export':
          details = '容器 ' + eventAttr.name + ' 导出';
          break;
        case 'health_status':
          details = '容器 ' + eventAttr.name + ' 执行健康状态';
          break;
        case 'oom':
          details = '容器 ' + eventAttr.name + ' 内存不足';
          break;
        case 'rename':
          details = '容器 ' + eventAttr.name + ' 重命名';
          break;
        case 'resize':
          details = '容器 ' + eventAttr.name + ' 调整大小';
          break;
        case 'top':
          details = '显示容器的运行进程 ' + eventAttr.name;
          break;
        case 'update':
          details = '容器 ' + eventAttr.name + ' 更新';
          break;
        default:
          if (event.Action.indexOf('exec_create') === 0) {
            details = 'Exec 实例已创建';
          } else if (event.Action.indexOf('exec_start') === 0) {
            details = 'Exec 实例启动';
          } else {
            details = '不支持的事件';
          }
      }
      break;
    case 'image':
      switch (event.Action) {
        case 'delete':
          details = '镜像已删除';
          break;
        case 'import':
          details = '镜像 ' + event.Actor.ID + ' 导入';
          break;
        case 'load':
          details = '镜像 ' + event.Actor.ID + ' 加载';
          break;
        case 'tag':
          details = '创建的新标签 ' + eventAttr.name;
          break;
        case 'untag':
          details = '镜像未标记';
          break;
        case 'save':
          details = '镜像 ' + event.Actor.ID + ' 保存';
          break;
        case 'pull':
          details = '镜像 ' + event.Actor.ID + ' 拉取';
          break;
        case 'push':
          details = '镜像 ' + event.Actor.ID + ' 推送';
          break;
        default:
          details = '不支持的事件';
      }
      break;
    case 'network':
      switch (event.Action) {
        case 'create':
          details = '网络 ' + eventAttr.name + ' 创建';
          break;
        case 'destroy':
          details = '网络 ' + eventAttr.name + ' 删除';
          break;
        case 'remove':
          details = '网络 ' + eventAttr.name + ' 删除';
          break;
        case 'connect':
          details = '容器连接到 ' + eventAttr.name + ' 网络';
          break;
        case 'disconnect':
          details = '容器已从 ' + eventAttr.name + ' 网络断开连接';
          break;
        default:
          details = '不支持的事件';
      }
      break;
    case 'volume':
      switch (event.Action) {
        case 'create':
          details = '存储卷 ' + event.Actor.ID + ' 创建';
          break;
        case 'destroy':
          details = '存储卷 ' + event.Actor.ID + ' 删除';
          break;
        case 'mount':
          details = '存储卷 ' + event.Actor.ID + ' 挂载';
          break;
        case 'unmount':
          details = '存储卷 ' + event.Actor.ID + ' 卸载';
          break;
        default:
          details = '不支持的事件';
      }
      break;
    default:
      details = '不支持的事件';
  }
  return details;
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
