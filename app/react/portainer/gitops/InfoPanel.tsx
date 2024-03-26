import clsx from 'clsx';

interface Props {
  url: string;
  configFilePath: string;
  additionalFiles?: string[];
  className: string;
  type: string;
}

export function InfoPanel({
  url,
  configFilePath,
  additionalFiles = [],
  className,
  type,
}: Props) {
  return (
    <div className={clsx('form-group', className)}>
      <div className="col-sm-12">
        <p>
        这个 {type} 是从 git 仓库 <code>{url}</code> 部署的。
        </p>
        <p>
          在 git 中更新
          <code>{[configFilePath, ...additionalFiles].join(', ')}</code>
          并从这里拉取以更新 {type}。
        </p>
      </div>
    </div>
  );
}
