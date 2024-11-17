import { Form, Formik } from 'formik';
import { Key } from 'lucide-react';
import { useState } from 'react';
import { SchemaOf, bool, object } from 'yup';

import { withHideOnExtension } from '@/react/hooks/withHideOnExtension';

import { Widget } from '@@/Widget';
import { LoadingButton } from '@@/buttons';
import {
  file,
  withFileExtension,
} from '@@/form-components/yup-file-validation';
import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FileUploadField } from '@@/form-components/FileUpload';
import { SwitchField } from '@@/form-components/SwitchField';

import { useUpdateSSLConfigMutation } from '../useUpdateSSLConfigMutation';
import { useSSLSettings } from '../../queries/useSSLSettings';

interface FormValues {
  certFile?: File;
  keyFile?: File;
  forceHTTPS: boolean;
}

export const SSLSettingsPanelWrapper = withHideOnExtension(SSLSettingsPanel);

function SSLSettingsPanel() {
  const settingsQuery = useSSLSettings();
  const [reloadingPage, setReloadingPage] = useState(false);
  const mutation = useUpdateSSLConfigMutation();

  if (!settingsQuery.data) {
    return null;
  }

  const initialValues: FormValues = {
    certFile: undefined,
    keyFile: undefined,
    forceHTTPS: !settingsQuery.data.httpEnabled,
  };

  return (
    <Widget>
      <Widget.Title icon={Key} title="SSL certificate" />
      <Widget.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validation}
          validateOnMount
        >
          {({ values, setFieldValue, isValid, errors, dirty }) => (
            <Form className="form-horizontal">
              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="orange">
                    强制使用 HTTPS 仅会导致 Portainer 停止监听 HTTP 端口。任何使用 HTTP 的边缘代理环境将无法再访问。
                  </TextTip>
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <SwitchField
                    checked={values.forceHTTPS}
                    label="仅强制使用 HTTPS"
                    labelClass="col-sm-3 col-lg-2"
                    name="forceHTTPS"
                    onChange={(value) => setFieldValue('forceHTTPS', value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-12">
                  <TextTip color="blue">
                    提供一个新的 SSL 证书来替换现有的用于 HTTPS 连接的证书。
                  </TextTip>
                </div>
              </div>

              <FormControl
                label="SSL/TLS 证书"
                tooltip="选择一个 X.509 证书文件，通常是 crt、cer 或 pem 文件。"
                inputId="ca-cert-field"
                errors={errors.certFile}
              >
                <FileUploadField
                  inputId="ca-cert-field"
                  name="certFile"
                  onChange={(file) => setFieldValue('certFile', file)}
                  value={values.certFile}
                />
              </FormControl>

              <FormControl
                label="SSL/TLS 私钥"
                tooltip="选择一个私钥文件，通常是 key 或 pem 文件。"
                inputId="ca-cert-field"
                errors={errors.keyFile}
              >
                <FileUploadField
                  inputId="ca-cert-field"
                  name="keyFile"
                  onChange={(file) => setFieldValue('keyFile', file)}
                  value={values.keyFile}
                />
              </FormControl>

              <div className="form-group">
                <div className="col-sm-12">
                  <LoadingButton
                    isLoading={mutation.isLoading || reloadingPage}
                    disabled={!dirty || !isValid}
                    loadingText={reloadingPage ? '重新加载中' : '保存中'}
                    className="!ml-0"
                  >
                    保存 SSL 设置
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Widget.Body>
    </Widget>
  );

  function handleSubmit({ certFile, forceHTTPS, keyFile }: FormValues) {
    mutation.mutate(
      { certFile, httpEnabled: !forceHTTPS, keyFile },
      {
        async onSuccess() {
          await new Promise((resolve) => {
            setTimeout(resolve, 10000);
          });
          window.location.reload();
          setReloadingPage(true);
        },
      }
    );
  }
}

function validation(): SchemaOf<FormValues> {
  return object({
    certFile: withFileExtension(file(), [
      'pem',
      'crt',
      'cer',
      'cert',
    ]).optional(),
    keyFile: withFileExtension(file(), ['pem', 'key']).optional(),
    forceHTTPS: bool().required(),
  });
}
