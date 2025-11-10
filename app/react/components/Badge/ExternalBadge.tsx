import { Badge } from '@@/Badge';

export function ExternalBadge({ className }: { className?: string }) {
  return (
    <Badge type="info" className={className}>
      外部
    </Badge>
  );
}
