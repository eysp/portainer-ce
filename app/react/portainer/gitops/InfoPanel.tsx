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
          此 {type} 是从 Git 仓库 <code>{url}</code> 部署的。
        </p>
        <p>
          更新
          <code>{[configFilePath, ...additionalFiles].join(', ')}</code>
          在 Git 中，然后从此处拉取以更新 {type}。
        </p>
      </div>
    </div>
  );
}
