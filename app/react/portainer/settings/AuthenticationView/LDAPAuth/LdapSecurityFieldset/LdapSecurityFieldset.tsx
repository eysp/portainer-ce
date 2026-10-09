import { FormikErrors } from 'formik';

import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isLimitedToBE } from '@/react/portainer/feature-flags/feature-flags.service';

import { FileUploadField } from '@@/form-components/FileUpload';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { SwitchField } from '@@/form-components/SwitchField';
import { BEFeatureIndicator } from '@@/BEFeatureIndicator';

export interface LdapSecurityConfig {
  startTLS: boolean;
  tls: boolean;
  tlsSkipVerify: boolean;
  caCertFile?: File | null;
}

interface Props {
  values: LdapSecurityConfig;
  onChange: (value: Partial<LdapSecurityConfig>) => void;
  errors?: FormikErrors<LdapSecurityConfig>;
  title?: string;
  uploadState?: 'uploading' | 'success';
  limitedFeatureId?: FeatureId;
}

export function LdapSecurityFieldset({
  values,
  onChange,
  errors,
  title = 'LDAP 安全',
  uploadState,
  limitedFeatureId,
}: Props) {
  const showCaCert = values.tls || (values.startTLS && !values.tlsSkipVerify);
  const isCaCertLimited = isLimitedToBE(limitedFeatureId);

  return (
    <FormSection title={title}>
      {!values.tls && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              label="使用 StartTLS"
              checked={values.startTLS}
              onChange={(checked) => onChange({ startTLS: checked })}
              tooltip="如果您希望使用 StartTLS 保护与服务器的连接，请启用此选项。如果选择了“使用 TLS”，则忽略此项。"
              labelClass="col-sm-3 col-lg-2"
              featureId={limitedFeatureId}
              data-cy="starttls-toggle"
            />
          </div>
        </div>
      )}

      {!values.startTLS && (
        <div className="form-group">
          <div className="col-sm-12">
            <SwitchField
              label="使用 TLS"
              checked={values.tls}
              onChange={(checked) => onChange({ tls: checked })}
              tooltip="如果您需要指定 TLS 证书以连接到 LDAP 服务器，请启用此选项。"
              labelClass="col-sm-3 col-lg-2"
              featureId={limitedFeatureId}
              data-cy="tls-toggle"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            label="跳过验证服务器证书"
            checked={values.tlsSkipVerify}
            onChange={(checked) => onChange({ tlsSkipVerify: checked })}
            tooltip="跳过服务器 TLS 证书的验证。不建议在不安全的网络上使用。"
            labelClass="col-sm-3 col-lg-2"
            featureId={limitedFeatureId}
            data-cy="tls-skip-verify-toggle"
          />
        </div>
      </div>

      {showCaCert && (
        <FormControl
          label="TLS CA 证书"
          errors={errors?.caCertFile}
          inputId="tls-ca-cert"
        >
          <FileUploadField
            inputId="tls-ca-cert"
            onChange={(file) => onChange({ caCertFile: file })}
            value={values.caCertFile}
            title="选择文件"
            required
            data-cy="tls-ca-cert-upload"
            state={uploadState}
            disabled={isCaCertLimited}
          />
          {limitedFeatureId && (
            <BEFeatureIndicator featureId={limitedFeatureId} />
          )}
        </FormControl>
      )}
    </FormSection>
  );
}
