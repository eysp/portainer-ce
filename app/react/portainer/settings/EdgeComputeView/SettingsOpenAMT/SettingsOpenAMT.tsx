import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Laptop } from 'lucide-react';

import { OpenAMTConfiguration } from '@/react/edge/edge-devices/open-amt/types';

import { Switch } from '@@/form-components/SwitchField/Switch';
import { FormControl } from '@@/form-components/FormControl';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';
import { FileUploadField } from '@@/form-components/FileUpload';

import { validationSchema } from './SettingsOpenAMT.validation';

export interface Settings {
  openAMTConfiguration: OpenAMTConfiguration;
  EnableEdgeComputeFeatures: boolean;
}

interface Props {
  settings: Settings;
  onSubmit(values: OpenAMTConfiguration): void;
}

export function SettingsOpenAMT({ settings, onSubmit }: Props) {
  const [certFile, setCertFile] = useState<File>();
  async function handleFileUpload(
    file: File,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => void
  ) {
    if (file) {
      setCertFile(file);
      const fileContent = await readFileContent(file);
      setFieldValue('certFileContent', fileContent);
      setFieldValue('certFileName', file.name);
    }
  }

  function readFileContent(file: File) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target == null || e.target.result == null) {
          resolve('');
          return;
        }
        const base64 = e.target.result.toString();
        // remove prefix of "data:application/x-pkcs12;base64," returned by "readAsDataURL()"
        const index = base64.indexOf('base64,');
        const cert = base64.substring(index + 7, base64.length);
        resolve(cert);
      };
      fileReader.onerror = () => {
        reject(new Error('读取配置证书文件时出错'));
      };
      fileReader.readAsDataURL(file);
    });
  }

  const openAMTConfiguration = settings ? settings.openAMTConfiguration : null;
  const initialValues = {
    enabled: openAMTConfiguration ? openAMTConfiguration.enabled : false,
    mpsServer: openAMTConfiguration ? openAMTConfiguration.mpsServer : '',
    mpsUser: openAMTConfiguration ? openAMTConfiguration.mpsUser : '',
    mpsPassword: openAMTConfiguration ? openAMTConfiguration.mpsPassword : '',
    domainName: openAMTConfiguration ? openAMTConfiguration.domainName : '',
    certFileContent: openAMTConfiguration
      ? openAMTConfiguration.certFileContent
      : '',
    certFileName: openAMTConfiguration ? openAMTConfiguration.certFileName : '',
    certFilePassword: openAMTConfiguration
      ? openAMTConfiguration.certFilePassword
      : '',
  };

  if (
    initialValues.certFileContent &&
    initialValues.certFileName &&
    !certFile
  ) {
    setCertFile(new File([], initialValues.certFileName));
  }

  const edgeComputeFeaturesEnabled = settings
    ? settings.EnableEdgeComputeFeatures
    : false;

  return (
    <div className="row">
      <Widget>
        <WidgetTitle icon={Laptop} title="Intel OpenAMT" />
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
                  inputId="edge_enableOpenAMT"
                  label="启用 OpenAMT"
                  errors={errors.enabled}
                  size="small"
                >
                  <Switch
                    id="edge_enableOpenAMT"
                    name="edge_enableOpenAMT"
                    className="space-right"
                    disabled={!edgeComputeFeaturesEnabled}
                    checked={edgeComputeFeaturesEnabled && values.enabled}
                    onChange={(e) => setFieldValue('enabled', e)}
                  />
                </FormControl>

                <TextTip color="blue" className="mb-2">
                  启用后，这将允许 Portainer 与 OpenAMT MPS API 进行交互。
                </TextTip>

                {edgeComputeFeaturesEnabled && values.enabled && (
                  <>
                    <hr />

                    <FormControl
                      inputId="mps_server"
                      label="MPS 服务器"
                      size="medium"
                      errors={errors.mpsServer}
                    >
                      <Field
                        as={Input}
                        name="mpsServer"
                        id="mps_server"
                        placeholder="请输入 MPS 服务器地址"
                        value={values.mpsServer}
                        data-cy="openAMT-serverInput"
                      />
                    </FormControl>

                    <FormControl
                      inputId="mps_username"
                      label="MPS 用户名"
                      size="medium"
                      errors={errors.mpsUser}
                    >
                      <Field
                        as={Input}
                        name="mpsUser"
                        id="mps_username"
                        placeholder="请输入 MPS 用户名"
                        value={values.mpsUser}
                        data-cy="openAMT-usernameInput"
                      />
                    </FormControl>

                    <FormControl
                      inputId="mps_password"
                      label="MPS 密码"
                      size="medium"
                      tooltip="Needs to be 8-32 characters including one uppercase, one lowercase letters, one base-10 digit and one special character."
                      errors={errors.mpsPassword}
                    >
                      <Field
                        as={Input}
                        type="password"
                        name="mpsPassword"
                        id="mps_password"
                        placeholder="请输入 MPS 密码"
                        value={values.mpsPassword}
                        data-cy="openAMT-passwordInput"
                      />
                    </FormControl>

                    <hr />

                    <FormControl
                      inputId="domain_name"
                      label="域名"
                      size="medium"
                      tooltip="请输入与配置证书关联的 FQDN（例如：amtdomain.com）"
                      errors={errors.domainName}
                    >
                      <Field
                        as={Input}
                        name="domainName"
                        id="domain_name"
                        placeholder="请输入域名"
                        value={values.domainName}
                        data-cy="openAMT-domainInput"
                      />
                    </FormControl>

                    <FormControl
                      inputId="certificate_file"
                      label="配置证书文件 (.pfx)"
                      size="medium"
                      tooltip="Supported CAs are Comodo, DigiCert, Entrust and GoDaddy.<br>The certificate must contain the private key.<br>On AMT 15 based devices you need to use SHA2."
                      errors={errors.certFileContent}
                      setTooltipHtmlMessage
                    >
                      <FileUploadField
                        inputId="certificate_file"
                        title="上传文件"
                        accept=".pfx"
                        value={certFile}
                        onChange={(file) =>
                          handleFileUpload(file, setFieldValue)
                        }
                      />
                    </FormControl>

                    <FormControl
                      inputId="certificate_password"
                      label="配置证书密码"
                      size="medium"
                      tooltip="密码需要包含 8-32 个字符，包括一个大写字母、一个小写字母、一位数字和一个特殊字符。"
                      errors={errors.certFilePassword}
                    >
                      <Field
                        as={Input}
                        type="password"
                        name="certFilePassword"
                        id="certificate_password"
                        placeholder="**********"
                        value={values.certFilePassword}
                        data-cy="openAMT-certPasswordInput"
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
                      loadingText="保存设置..."
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
