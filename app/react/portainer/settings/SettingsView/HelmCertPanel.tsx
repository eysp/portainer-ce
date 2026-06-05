import { Form, Formik, useFormikContext } from 'formik';
import { Key } from 'lucide-react';
import { SchemaOf, object } from 'yup';

import { notifySuccess } from '@/portainer/services/notifications';

import { Widget } from '@@/Widget';
import { TextTip } from '@@/Tip/TextTip';
import { FileUploadField } from '@@/form-components/FileUpload';
import { FormControl } from '@@/form-components/FormControl';
import {
  file,
  withFileExtension,
} from '@@/form-components/yup-file-validation';
import { FormActions } from '@@/form-components/FormActions';
import { BEOverlay } from '@@/BEFeatureIndicator/BEOverlay';

import { FeatureId } from '../../feature-flags/enums';

import { useUpdateSSLConfigMutation } from './useUpdateSSLConfigMutation';

interface FormValues {
  clientCertFile: File | null;
}

export function HelmCertPanel() {
  const mutation = useUpdateSSLConfigMutation();
  const initialValues = {
    clientCertFile: null,
  };

  return (
    <BEOverlay featureId={FeatureId.CA_FILE} variant="widget">
      <Widget>
        <Widget.Title
          icon={Key}
          title="Kubernetes Helm 仓库的证书颁发机构文件"
        />
        <Widget.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validation}
            onSubmit={handleSubmit}
            validateOnMount
          >
            <InnerForm isLoading={mutation.isLoading} />
          </Formik>
        </Widget.Body>
      </Widget>
    </BEOverlay>
  );

  function handleSubmit({ clientCertFile }: FormValues) {
    if (!clientCertFile) {
      return;
    }

    mutation.mutate(
      { clientCertFile },
      {
        onSuccess() {
          notifySuccess('成功', 'Helm 证书已更新');
        },
      }
    );
  }
}

function InnerForm({ isLoading }: { isLoading: boolean }) {
  const { values, setFieldValue, errors, isValid } =
    useFormikContext<FormValues>();

  return (
    <Form className="form-horizontal">
      <div className="form-group">
        <div className="col-sm-12">
          <TextTip color="blue">
            提供额外的 CA 文件，其中包含用于连接 Helm 仓库 HTTPS
            连接的证书。
          </TextTip>
        </div>
      </div>

      <FormControl
        label="CA 文件"
        tooltip="选择包含 X.509 证书的 CA 文件，通常是 crt、cer 或 pem 文件。"
        inputId="ca-cert-field"
        errors={errors?.clientCertFile}
      >
        <FileUploadField
          required
          data-cy="helm-cert-panel-file-upload-field"
          inputId="ca-cert-field"
          name="clientCertFile"
          onChange={(file) => setFieldValue('clientCertFile', file)}
          value={values.clientCertFile}
        />
      </FormControl>

      <FormActions
        isValid={isValid}
        isLoading={isLoading}
        submitLabel="应用更改"
        loadingText="正在保存..."
        data-cy="helm-cert-panel-submit-button"
      />
    </Form>
  );
}

function validation(): SchemaOf<FormValues> {
  return object({
    clientCertFile: withFileExtension(file(), [
      'pem',
      'crt',
      'cer',
      'cert',
    ]).required(''),
  });
}
