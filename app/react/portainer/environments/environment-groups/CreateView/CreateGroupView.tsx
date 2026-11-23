import { useRouter } from '@uirouter/react';
import { FormikHelpers } from 'formik';

import { notifySuccess } from '@/portainer/services/notifications';

import { Widget } from '@@/Widget';
import { PageHeader } from '@@/PageHeader';

import { useCreateGroupMutation } from '../queries/useCreateGroupMutation';
import { GroupForm, GroupFormValues } from '../components/GroupForm';

export function CreateGroupView() {
  const router = useRouter();
  const createMutation = useCreateGroupMutation();

  const initialValues: GroupFormValues = {
    name: '',
    description: '',
    tagIds: [],
    associatedEnvironments: [],
  };

  return (
    <>
      <PageHeader
        title="创建分组"
        breadcrumbs={[
          { label: '分组', link: 'portainer.groups' },
          { label: '创建分组' },
        ]}
      />

      <div className="mx-4 pb-20">
        <Widget>
          <Widget.Body>
            <GroupForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              submitLabel="创建"
              submitLoadingLabel="正在创建..."
            />
          </Widget.Body>
        </Widget>
      </div>
    </>
  );

  function handleSubmit(
    values: GroupFormValues,
    { resetForm }: FormikHelpers<GroupFormValues>
  ): Promise<void> {
    return new Promise((resolve) => {
      createMutation.mutate(
        {
          name: values.name,
          description: values.description,
          tagIds: values.tagIds,
          associatedEnvironments: values.associatedEnvironments,
        },
        {
          onSuccess: () => {
            resetForm();
            notifySuccess('Success', '分组创建成功');
            router.stateService.go('portainer.groups');
          },
          onSettled: () => resolve(),
        }
      );
    });
  }
}
