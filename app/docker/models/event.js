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
      details = '容器 ' + eventAttr.name + ' 以退出状态码 ' + eventAttr.exitCode + ' 退出';
      break;
    case 'commit':
      details = '容器 ' + eventAttr.name + ' 已提交';
      break;
    case 'restart':
      details = '容器 ' + eventAttr.name + ' 已重启';
      break;
    case 'pause':
      details = '容器 ' + eventAttr.name + ' 已暂停';
      break;
    case 'unpause':
      details = '容器 ' + eventAttr.name + ' 已取消暂停';
      break;
    case 'attach':
      details = '容器 ' + eventAttr.name + ' 已附加';
      break;
    case 'detach':
      details = '容器 ' + eventAttr.name + ' 已分离';
      break;
    case 'copy':
      details = '容器 ' + eventAttr.name + ' 已复制';
      break;
    case 'export':
      details = '容器 ' + eventAttr.name + ' 已导出';
      break;
    case 'health_status':
      details = '容器 ' + eventAttr.name + ' 执行了健康状态';
      break;
    case 'oom':
      details = '容器 ' + eventAttr.name + ' 内存不足';
      break;
    case 'rename':
      details = '容器 ' + eventAttr.name + ' 已重命名';
      break;
    case 'resize':
      details = '容器 ' + eventAttr.name + ' 已调整大小';
      break;
    case 'top':
      details = '显示容器 ' + eventAttr.name + ' 的运行进程';
      break;
    case 'update':
      details = '容器 ' + eventAttr.name + ' 已更新';
      break;
    case 'exec_create':
      details = '已创建执行实例';
      break;
    case 'exec_start':
      details = '已启动执行实例';
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
        details = '镜像已删除';
        break;
      case 'import':
        details = '已导入镜像 ' + event.Actor.ID;
        break;
      case 'load':
        details = '已加载镜像 ' + event.Actor.ID;
        break;
      case 'tag':
        details = '为 ' + eventAttr.name + ' 创建了新标签';
        break;
      case 'untag':
        details = '已取消镜像标签';
        break;
      case 'save':
        details = '已保存镜像 ' + event.Actor.ID;
        break;
      case 'pull':
        details = '已拉取镜像 ' + event.Actor.ID;
        break;
      case 'push':
        details = '已推送镜像 ' + event.Actor.ID;
        break;
      default:
        details = '不支持的事件';
    }
    break;
    case 'network':
  switch (action) {
    case 'create':
      details = '已创建网络 ' + eventAttr.name;
      break;
    case 'destroy':
      details = '已删除网络 ' + eventAttr.name;
      break;
    case 'remove':
      details = '已删除网络 ' + eventAttr.name;
      break;
    case 'connect':
      details = '容器连接到 ' + eventAttr.name + ' 网络';
      break;
    case 'disconnect':
      details = '容器从 ' + eventAttr.name + ' 网络断开连接';
      break;
    default:
      details = '不支持的事件';
  }
  break;
case 'volume':
  switch (action) {
    case 'create':
      details = '已创建存储卷 ' + event.Actor.ID;
      break;
    case 'destroy':
      details = '已删除存储卷 ' + event.Actor.ID;
      break;
    case 'mount':
      details = '已挂载存储卷 ' + event.Actor.ID;
      break;
    case 'unmount':
      details = '已卸载存储卷 ' + event.Actor.ID;
      break;
    default:
      details = '不支持的事件';
  }
  break;
default:
  details = '不支持的事件';
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
