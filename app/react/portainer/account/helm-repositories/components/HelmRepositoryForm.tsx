import { Field, Form, Formik } from 'formik';
import { useRouter } from '@uirouter/react';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { Button } from '@@/buttons';

import { HelmRepositoryFormValues } from '../../AccountView/HelmRepositoryDatatable/types';

import { validationSchema } from './CreateHelmRepositoryForm.validation';

type Props = {
  isEditing?: boolean;
  isLoading: boolean;
  onSubmit: (formValues: HelmRepositoryFormValues) => void;
  URLs: string[];
};

const defaultInitialValues: HelmRepositoryFormValues = {
  URL: '',
};

export function HelmRepositoryForm({
  isEditing = false,
  isLoading,
  onSubmit,
  URLs,
}: Props) {
  const router = useRouter();

  return (
    <Formik<HelmRepositoryFormValues>
      initialValues={defaultInitialValues}
      enableReinitialize
      validationSchema={() => validationSchema(URLs)}
      onSubmit={(values) => onSubmit(values)}
      validateOnMount
    >
      {({ values, errors, handleSubmit, isValid, dirty }) => (
        <Form className="form-horizontal" onSubmit={handleSubmit} noValidate>
          <FormControl
            inputId="url-field"
            label="URL"
            errors={errors.URL}
            required
          >
            <Field
              as={Input}
              name="URL"
              value={values.URL}
              autoComplete="off"
              id="url-field"
            />
          </FormControl>
          <div className="form-group">
            <div className="col-sm-12 mt-3">
              <LoadingButton
                disabled={!isValid || !dirty}
                isLoading={isLoading}
                loadingText="保存Helm仓库..."
              >
                {isEditing ? '更新Helm仓库' : '保存Helm仓库'}
              </LoadingButton>
              {isEditing && (
                <Button
                  color="default"
                  onClick={() => router.stateService.go('portainer.account')}
                >
                  取消
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
