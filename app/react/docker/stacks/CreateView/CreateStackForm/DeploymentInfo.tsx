import { TextTip } from '@@/Tip/TextTip';

interface Props {
  isSwarm: boolean;
  composeSyntaxMaxVersion?: number;
}

export function DeploymentInfo({ isSwarm, composeSyntaxMaxVersion }: Props) {
  if (isSwarm) {
    return (
      <div className="form-group">
        <div className="col-sm-12">
          <span className="text-muted small">
            此堆栈将使用等效于 <code>docker stack deploy</code> 命令的方式部署。
          </span>
        </div>
      </div>
    );
  }

  if (composeSyntaxMaxVersion === 2) {
    return (
      <div className="form-group">
        <div className="col-sm-12">
          <div className="text-muted small mb-2">
            此堆栈将使用等效于 <code>docker compose</code> 的方式部署。目前仅支持 Compose 文件格式版本 <b>2</b>。
          </div>
          <TextTip color="orange">
            注意：由于 libcompose 的限制，堆栈名称将被标准化以删除所有特殊字符和大写字母。
          </TextTip>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <span className="text-muted small">
          此堆栈将使用 <code>docker compose</code> 部署。
        </span>
      </div>
    </div>
  );
}
