import { useField } from 'formik';

import { SwitchField } from '@@/form-components/SwitchField';
import { useDocsUrl } from '@@/PageHeader/ContextHelp';

export function EnableTelemetryField() {
  const privacyPolicy = useDocsUrl('/in-app-analytics-and-privacy-policy');
  const [{ value }, , { setValue }] = useField<boolean>('enableTelemetry');

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          labelClass="col-sm-3 col-lg-2"
          data-cy="settings-enable-telemetry-switch"
          label="允许收集匿名统计信息"
          checked={value}
          name="toggle_enableTelemetry"
          onChange={(checked) => setValue(checked)}
        />
      </div>

      <div className="col-sm-12 text-muted small mt-2">
        您可以在我们的{' '}
        <a href={privacyPolicy} target="_blank" rel="noreferrer">
          隐私政策
        </a>
        中找到更多相关信息。
      </div>
    </div>
  );
}
