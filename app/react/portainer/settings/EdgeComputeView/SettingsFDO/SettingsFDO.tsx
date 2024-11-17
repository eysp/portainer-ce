import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { FlaskConical, Laptop } from 'lucide-react';

import { FDOConfiguration } from '@/portainer/hostmanagement/fdo/model';
import {
  FeatureFlag,
  useFeatureFlag,
} from '@/react/portainer/feature-flags/useFeatureFlag';

import { Switch } from '@@/form-components/SwitchField/Switch';
import { FormControl } from '@@/form-components/FormControl';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';

import { FDOProfilesDatatable } from '../FDOProfilesDatatable';

import styles from './SettingsFDO.module.css';
import { validationSchema } from './SettingsFDO.validation';

export interface Settings {
  fdoConfiguration: FDOConfiguration;
  EnableEdgeComputeFeatures: boolean;
}

interface Props {
  settings: Settings;
  onSubmit(values: FDOConfiguration): void;
}

export function SettingsFDO({ settings, onSubmit }: Props) {
  const flagEnabledQuery = useFeatureFlag(FeatureFlag.FDO);

  if (!flagEnabledQuery.data) {
    return (
      <Widget>
        <Widget.Body>
          <TextTip color="blue" icon={FlaskConical}>
            Since FDO is still an experimental feature that requires additional
            infrastructure, it has been temporarily hidden in the UI.
          </TextTip>
        </Widget.Body>
      </Widget>
    );
  }

  return <SettingsFDOForm settings={settings} onSubmit={onSubmit} />;
}

export function SettingsFDOForm({ settings, onSubmit }: Props) {
  const fdoConfiguration = settings ? settings.fdoConfiguration : null;
  const initialFDOEnabled = fdoConfiguration ? fdoConfiguration.enabled : false;

  const [isFDOEnabled, setIsFDOEnabled] = useState(initialFDOEnabled);
  useEffect(() => {
    setIsFDOEnabled(settings?.fdoConfiguration?.enabled);
  }, [settings]);

  const initialValues = {
    enabled: initialFDOEnabled,
    ownerURL: fdoConfiguration ? fdoConfiguration.ownerURL : '',
    ownerUsername: fdoConfiguration ? fdoConfiguration.ownerUsername : '',
    ownerPassword: fdoConfiguration ? fdoConfiguration.ownerPassword : '',
  };

  const edgeComputeFeaturesEnabled = settings
    ? settings.EnableEdgeComputeFeatures
    : false;

  return (
    <div className="row">
      <Widget>
        <WidgetTitle icon={Laptop} title="FDO" />
        <WidgetBody>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            enableReinitialize
            validationSchema={() => validationSchema()}
            validateOnChange
            validateOnMount
          >
            {({
              values,
              errors,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              isValid,
              dirty,
            }) => (
              <Form className="form-horizontal" onSubmit={handleSubmit}>
                <FormControl
                  inputId="edge_enableFDO"
                  label="启用FDO管理服务"
                  size="small"
                  errors={errors.enabled}
                >
                  <Switch
                    id="edge_enableFDO"
                    name="edge_enableFDO"
                    className="space-right"
                    disabled={!edgeComputeFeaturesEnabled}
                    checked={edgeComputeFeaturesEnabled && values.enabled}
                    onChange={(e) => onChangedEnabled(e, setFieldValue)}
                  />
                </FormControl>

                <TextTip color="blue" className="mb-2">
                  启用后，Portainer将能够与FDO服务进行交互。
                </TextTip>

                {edgeComputeFeaturesEnabled && values.enabled && (
                  <>
                    <hr />

                    <FormControl
                      inputId="owner_url"
                      label="所有者服务服务器"
                      errors={errors.ownerURL}
                    >
                      <Field
                        as={Input}
                        name="ownerURL"
                        id="owner_url"
                        placeholder="http://127.0.0.1:8042"
                        value={values.ownerURL}
                        data-cy="fdo-serverInput"
                      />
                    </FormControl>

                    <FormControl
                      inputId="owner_username"
                      label="所有者服务用户名"
                      errors={errors.ownerUsername}
                    >
                      <Field
                        as={Input}
                        name="ownerUsername"
                        id="owner_username"
                        placeholder="用户名"
                        value={values.ownerUsername}
                        data-cy="fdo-usernameInput"
                      />
                    </FormControl>

                    <FormControl
                      inputId="owner_password"
                      label="所有者服务密码"
                      errors={errors.ownerPassword}
                    >
                      <Field
                        as={Input}
                        type="password"
                        name="ownerPassword"
                        id="owner_password"
                        placeholder="密码"
                        value={values.ownerPassword}
                        data-cy="fdo-passwordInput"
                      />
                    </FormControl>
                  </>
                )}

                <div className="form-group mt-5">
                  <div className="col-sm-12">
                    <LoadingButton
                      disabled={!isValid || !dirty}
                      data-cy="settings-fdoButton"
                      isLoading={isSubmitting}
                      loadingText="正在保存设置..."
                    >
                      保存设置
                    </LoadingButton>
                  </div>
                </div>
              </Form>
            )}
          </Formik>

          {edgeComputeFeaturesEnabled && isFDOEnabled && (
            <div className={styles.fdoTable}>
              <FormSectionTitle>设备配置文件</FormSectionTitle>
              <TextTip color="blue" className="mb-2">
                添加、编辑和管理在FDO设备设置过程中可用的设备配置文件列表
              </TextTip>
              <FDOProfilesDatatable isFDOEnabled={initialFDOEnabled} />
            </div>
          )}
        </WidgetBody>
      </Widget>
    </div>
  );

  async function onChangedEnabled(
    e: boolean,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => void
  ) {
    setIsFDOEnabled(e);
    setFieldValue('enabled', e);
  }
}
