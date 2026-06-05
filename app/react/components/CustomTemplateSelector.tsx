import { useMemo } from 'react';

import { useCustomTemplates } from '@/react/portainer/templates/custom-templates/queries/useCustomTemplates';
import { CustomTemplate } from '@/react/portainer/templates/custom-templates/types';
import { StackType } from '@/react/common/stacks/types';

import { FormControl } from '@@/form-components/FormControl';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

interface Props {
  value: CustomTemplate['Id'] | undefined;
  onChange: (template: CustomTemplate['Id'] | undefined) => void;

  error?: string;
  stackType?: StackType;
  newTemplatePath?: string;
}

export function CustomTemplateSelector({
  value,
  onChange,
  error,
  stackType,
  newTemplatePath,
}: Props) {
  const inputId = 'custom-template-selector';

  const customTemplatesQuery = useCustomTemplates({
    params: stackType ? { type: [stackType] } : {},
  });

  const templateOptions = useMemo(() => {
    if (!customTemplatesQuery.data) {
      return [];
    }

    return customTemplatesQuery.data.map((template) => ({
      label: `${template.Title}${
        template.Description ? ` - ${template.Description}` : ''
      }`,
      value: template.Id,
    }));
  }, [customTemplatesQuery]);

  const { isLoading } = customTemplatesQuery;
  const hasTemplates = templateOptions.length > 0;

  return (
    <FormControl
      label="模板"
      inputId={inputId}
      errors={error}
      tooltip="选择自定义模板以部署为堆栈"
    >
      {hasTemplates && (
        <PortainerSelect
          placeholder="选择自定义模板"
          options={templateOptions}
          value={value}
          onChange={handleChange}
          isClearable
          isLoading={isLoading}
          data-cy={inputId}
          inputId={inputId}
        />
      )}

      {!isLoading && !hasTemplates && (
        <span className="small text-muted">
          没有可用的自定义模板。
          {newTemplatePath && (
            <>
              {' '}
              前往{' '}
              <a href={newTemplatePath}>自定义模板视图</a>创建一个。
            </>
          )}
        </span>
      )}
    </FormControl>
  );

  function handleChange(templateId: number | undefined) {
    onChange(templateId);
  }
}
