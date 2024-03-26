import { useIsDemo } from '@/react/portainer/system/useSystemStatus';

export function DemoAlert() {
  const isDemoQuery = useIsDemo();
  if (!isDemoQuery.data) {
    return null;
  }

  return (
    <div className="col-sm-12 mt-2">
      <span className="small text-muted">
        在 Portainer 的演示版本中无法使用此功能。
      </span>
    </div>
  );
}
