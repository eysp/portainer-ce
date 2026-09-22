import { notifySuccess } from '@/portainer/services/notifications';
import { useParamState } from '@/react/hooks/useParamState';
import { ContainerEngine } from '@/react/portainer/environments/types';

import { PageHeader } from '@@/PageHeader';
import { confirmDelete } from '@@/modals/confirm';

import { useCustomTemplates } from '../queries/useCustomTemplates';
import { useDeleteTemplateMutation } from '../queries/useDeleteTemplateMutation';
import { CustomTemplate } from '../types';

import { StackFromCustomTemplateFormWidget } from './StackFromCustomTemplateFormWidget';
import { CustomTemplatesList } from './CustomTemplatesList';
import { useViewParams } from './useViewParams';

export function ListView() {
  const { params, getTemplateLinkParams, storageKey, viewType } =
    useViewParams();

  const templatesQuery = useCustomTemplates({
    params,
  });
  const deleteMutation = useDeleteTemplateMutation();
  const [selectedTemplateId] = useParamState<number>('template', (param) =>
    param ? parseInt(param, 10) : 0
  );

  return (
    <>
      <PageHeader title="自定义模板" breadcrumbs="自定义模板" />

      {viewType === ContainerEngine.Docker && !!selectedTemplateId && (
        <StackFromCustomTemplateFormWidget templateId={selectedTemplateId} />
      )}

      <CustomTemplatesList
        templates={templatesQuery.data}
        onDelete={handleDelete}
        templateLinkParams={getTemplateLinkParams}
        storageKey={storageKey}
        selectedId={selectedTemplateId}
      />
    </>
  );

  async function handleDelete(templateId: CustomTemplate['Id']) {
    if (
      !(await confirmDelete('确定要删除此模板吗？'))
    ) {
      return;
    }

    deleteMutation.mutate(templateId, {
      onSuccess: () => {
        notifySuccess('成功', '模板已删除');
      },
    });
  }
}
