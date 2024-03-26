import { useField } from 'formik';

import { useIsDemo } from '@/react/portainer/system/useSystemStatus';

import { SwitchField } from '@@/form-components/SwitchField';

import { DemoAlert } from './DemoAlert';

export function EnableTelemetryField() {
  const isDemoQuery = useIsDemo();
  const [{ value }, , { setValue }] = useField<boolean>('enableTelemetry');

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          labelClass="col-sm-3 col-lg-2"
          label="允许收集匿名统计数据"
          checked={value}
          name="toggle_enableTelemetry"
          onChange={(checked) => setValue(checked)}
          disabled={isDemoQuery.data}
        />
      </div>

      <DemoAlert />

      <div className="col-sm-12 text-muted small mt-2">
        您可以在我们的{' '}
        <a
          href="https://www.portainer.io/documentation/in-app-analytics-and-privacy-policy/"
          target="_blank"
          rel="noreferrer"
        >
          隐私政策
        </a>
        中找到更多关于此的信息。
      </div>
    </div>
  );
}
