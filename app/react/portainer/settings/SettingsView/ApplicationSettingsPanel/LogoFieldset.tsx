import { useField, Field } from 'formik';

import { useIsDemo } from '@/react/portainer/system/useSystemStatus';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';

import { useToggledValue } from '../useToggledValue';

import { DemoAlert } from './DemoAlert';

export function LogoFieldset() {
  const [{ name }, { error }] = useField<string>('logo');
  const isDemoQuery = useIsDemo();

  const [isEnabled, setIsEnabled] = useToggledValue('logo');

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="使用自定义 logo"
            checked={isEnabled}
            name="toggle_logo"
            labelClass="col-sm-3 col-lg-2"
            disabled={isDemoQuery.data}
            onChange={(checked) => setIsEnabled(checked)}
          />
        </div>

        <DemoAlert />
      </div>

      {isEnabled && (
        <div>
          <div className="form-group">
            <span className="col-sm-12 text-muted small">
              您可以在此处指定 logo 的 URL。为了获得最佳显示效果，logo 的尺寸应为 155px x 55px。
            </span>
          </div>
          <FormControl label="URL" inputId="logo_url" errors={error} required>
            <Field
              as={Input}
              name={name}
              id="logo_url"
              placeholder="https://mycompany.com/logo.png"
            />
          </FormControl>
        </div>
      )}
    </>
  );
}
