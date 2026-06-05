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
            您可以从此容器创建镜像，这允许您备份重要数据或保存有用的配置。之后您将能够基于此镜像启动另一个容器。
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
            注意：如果您不在镜像名称中指定标签，{' '}
            <span className="label label-default">latest</span> 将被使用。
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
