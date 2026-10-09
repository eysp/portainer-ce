import { Form, useFormikContext } from 'formik';

import { ImageConfigFieldset } from '@@/ImageConfigFieldset';
import { LoadingButton } from '@@/buttons';

import { FormValues } from './types';

export function CreateImageForm({
  onRateLimit,
  isLoading,
}: {
  onRateLimit: (limited?: boolean) => void;
  isLoading: boolean;
}) {
  const { values, setFieldValue, errors, isValid } =
    useFormikContext<FormValues>();

  return (
    <Form className="form-horizontal">
      <div className="form-group">
        <div className="col-sm-12">
          <span className="small text-muted">
            您可以基于此容器创建一个新镜像，以便备份重要数据或保存配置。之后您可以基于此镜像启动新容器。
          </span>
        </div>
      </div>

      <ImageConfigFieldset
        autoComplete
        values={values.config}
        setFieldValue={(field, value) =>
          setFieldValue(`config.${field}`, value)
        }
        errors={errors.config}
        onRateLimit={onRateLimit}
      />

      {/* Tag note */}
      <div className="form-group">
        <div className="col-sm-12">
          <span className="small text-muted">
            提示：如果您未在镜像名称中指定标签 (Tag)，将默认使用{' '}
            <span className="label label-default">latest</span>。
          </span>
        </div>
      </div>

      <LoadingButton
        isLoading={isLoading}
        disabled={!isValid}
        loadingText="正在创建镜像..."
        data-cy="create-image-button"
      >
        创建
      </LoadingButton>
    </Form>
  );
}
