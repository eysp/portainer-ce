import { truncateLeftRight } from '@/portainer/filters/filters';

import { CopyButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';

export function WebhookSettings({
  value,
  baseUrl,
  docsLink,
}: {
  docsLink?: string;
  value: string;
  baseUrl: string;
}) {
  const url = `${baseUrl}/${value}`;

  return (
    <FormControl
      label="Webhook"
      tooltip={
        !!docsLink && (
          <>
            查看{' '}
            <a href={docsLink} target="_blank" rel="noreferrer">
              Portainer关于webhook使用的文档
            </a>
            。
          </>
        )
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-muted">{truncateLeftRight(url)}</span>
        <CopyButton copyText={url} color="light">
          复制链接
        </CopyButton>
      </div>
    </FormControl>
  );
}
