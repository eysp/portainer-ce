import { SchemaOf, object, string } from 'yup';
import { FormikErrors } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

import { CustomTemplate } from '../../templates/custom-templates/types';

export interface Values {
  Title: string;
  Description: string;
  Note: string;
  Logo: string;
}

export function CommonFields({
  values,
  onChange,
  errors,
}: {
  values: Values;
  onChange: (values: Values) => void;
  errors?: FormikErrors<Values>;
}) {
  return (
    <>
      <FormControl
        label="标题"
        required
        inputId="template-title"
        errors={errors?.Title}
      >
        <Input
          name="title"
          placeholder="例如 mytemplate"
          id="template-title"
          required
          value={values.Title}
          onChange={(e) => {
            handleChange({ Title: e.target.value });
          }}
        />
      </FormControl>

      <FormControl
        label="描述"
        required
        inputId="template-description"
        errors={errors?.Description}
      >
        <Input
          name="description"
          id="template-description"
          required
          value={values.Description}
          onChange={(e) => {
            handleChange({ Description: e.target.value });
          }}
        />
      </FormControl>

      <FormControl label="备注" inputId="template-note" errors={errors?.Note}>
        <Input
          name="note"
          id="template-note"
          value={values.Note}
          onChange={(e) => {
            handleChange({ Note: e.target.value });
          }}
        />
      </FormControl>

      <FormControl label="Logo" inputId="template-logo" errors={errors?.Logo}>
        <Input
          name="logo"
          id="template-logo"
          value={values.Logo}
          onChange={(e) => {
            handleChange({ Logo: e.target.value });
          }}
        />
      </FormControl>
    </>
  );

  function handleChange(change: Partial<Values>) {
    onChange({ ...values, ...change });
  }
}

export function validation({
  currentTemplateId,
  templates = [],
}: {
  currentTemplateId?: CustomTemplate['Id'];
  templates?: Array<CustomTemplate>;
} = {}): SchemaOf<Values> {
  return object({
    Title: string()
      .required('标题是必填项。')
      .test(
        'is-unique',
        '标题必须是唯一的',
        (value) =>
          !value ||
          !templates.some(
            (template) =>
              template.Title === value && template.Id !== currentTemplateId
          )
      )
      .max(
        200,
        '自定义模板标题必须小于或等于 200 个字符'
      ),
    Description: string().required('描述是必填项。'),
    Note: string().default(''),
    Logo: string().default(''),
  });
}

export const TEMPLATE_NAME_VALIDATION_REGEX = '^[-_a-z0-9]+$';
