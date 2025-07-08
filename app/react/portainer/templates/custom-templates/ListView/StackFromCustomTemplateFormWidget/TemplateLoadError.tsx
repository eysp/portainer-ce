import { UserId } from '@/portainer/users/types';
import { useCurrentUser, useIsEdgeAdmin } from '@/react/hooks/useUser';
import { CustomTemplate } from '@/react/portainer/templates/custom-templates/types';

import { Link } from '@@/Link';
import { FormError } from '@@/form-components/FormError';

export function TemplateLoadError({
  templateId,
  creatorId,
}: {
  templateId: CustomTemplate['Id'];
  creatorId: UserId;
}) {
  const { user } = useCurrentUser();
  const isEdgeAdminQuery = useIsEdgeAdmin();

  if (isEdgeAdminQuery.isLoading) {
    return null;
  }

  const isAdminOrWriter = isEdgeAdminQuery.isAdmin || user.Id === creatorId;

  return (
    <FormError>
      {isAdminOrWriter ? (
        <>
          自定义模板无法加载，请{' '}
          <Link
            to=".edit"
            params={{ id: templateId }}
            data-cy="edit-custom-template-link"
          >
            点击这里
          </Link>{' '}
          进行配置
        </>
      ) : (
        <>
          自定义模板无法加载，请联系您的管理员。
        </>
      )}
    </FormError>
  );
}
