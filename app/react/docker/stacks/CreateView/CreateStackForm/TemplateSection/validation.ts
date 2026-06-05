import { SchemaOf, object, number, array, string } from 'yup';

import { validateYAML } from '@/react/docker/stacks/common/stackYamlValidation';

import { TemplateFormValues } from './types';

export function getTemplateValidationSchema({
  containerNames = [],
}: {
  containerNames: Array<string> | undefined;
}): SchemaOf<TemplateFormValues> {
  return object({
    selectedId: number().required('模板为必填项'),
    variables: array(
      object({
        key: string().required(),
        value: string().required(),
      })
    ).default([]),
    fileContent: string()
      .required('模板内容为必填项')
      .test('valid-yaml', '无效的 YAML', function validateYamlTest(value) {
        if (!value) {
          return true;
        }

        const yamlError = validateYAML(value, containerNames, []);

        if (yamlError) {
          return this.createError({ message: yamlError });
        }

        return true;
      }),
  });
}
