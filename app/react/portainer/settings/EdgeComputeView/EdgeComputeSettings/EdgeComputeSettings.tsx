import { Formik, Form } from 'formik';
import { Laptop } from 'lucide-react';

import { Settings } from '@/react/portainer/settings/types';
import { PortainerUrlField } from '@/react/portainer/common/PortainerUrlField';
import { PortainerTunnelAddrField } from '@/react/portainer/common/PortainerTunnelAddrField';
import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { Switch } from '@@/form-components/SwitchField/Switch';
import { FormControl } from '@@/form-components/FormControl';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

import { validationSchema } from './EdgeComputeSettings.validation';
import { FormValues } from './types';

interface Props {
  settings?: Settings;
  onSubmit(values: FormValues): void;
}

export function EdgeComputeSettings({ settings, onSubmit }: Props) {
  if (!settings) {
    return null;
  }

  const initialValues: FormValues = {
    EnableEdgeComputeFeatures: settings.EnableEdgeComputeFeatures,
    EdgePortainerUrl: settings.EdgePortainerUrl,
    Edge: {
      TunnelServerAddress: settings.Edge?.TunnelServerAddress,
    },
    EnforceEdgeID: settings.EnforceEdgeID,
  };

  return (
    <div className="row">
        <Widget>
            <WidgetTitle icon={Laptop} title="边缘计算设置" />

            <WidgetBody>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={() => validationSchema()}
                    onSubmit={onSubmit}
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
                        <Form
                            className="form-horizontal"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <FormControl
                                inputId="edge_enable"
                                label="启用边缘计算功能"
                                size="small"
                                errors={errors.EnableEdgeComputeFeatures}
                            >
                                <Switch
                                    id="edge_enable"
                                    name="edge_enable"
                                    className="space-right"
                                    checked={values.EnableEdgeComputeFeatures}
                                    onChange={(e) =>
                                        setFieldValue('EnableEdgeComputeFeatures', e)
                                    }
                                />
                            </FormControl>

                            <TextTip color="blue" className="mb-2">
                                启用此设置以使用 Portainer 边缘计算功能。
                            </TextTip>

                            {isBE && values.EnableEdgeComputeFeatures && (
                                <>
                                    <PortainerUrlField
                                        fieldName="EdgePortainerUrl"
                                        tooltip="Edge 代理用于发起通信的此 Portainer 实例的 URL。"
                                    />

                                    <PortainerTunnelAddrField fieldName="Edge.TunnelServerAddress" />
                                </>
                            )}

                            <FormControl
                                inputId="edge_enforce_id"
                                label="强制使用 Portainer 生成的 Edge ID"
                                size="small"
                                tooltip="此设置仅适用于手动创建的环境。"
                                errors={errors.EnforceEdgeID}
                            >
                                <Switch
                                    id="edge_enforce_id"
                                    name="edge_enforce_id"
                                    className="space-right"
                                    checked={values.EnforceEdgeID}
                                    onChange={(e) =>
                                        setFieldValue('EnforceEdgeID', e.valueOf())
                                    }
                                />
                            </FormControl>

                            <div className="form-group mt-5">
                                <div className="col-sm-12">
                                    <LoadingButton
                                        disabled={!isValid || !dirty}
                                        data-cy="settings-edgeComputeButton"
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
            </WidgetBody>
        </Widget>
    </div>
);
}
