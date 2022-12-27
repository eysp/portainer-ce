import { FormikErrors } from 'formik';

import { useUser } from '@/portainer/hooks/useUser';

import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { SwitchField } from '@@/form-components/SwitchField';

import { EditDetails } from '../EditDetails';
import { ResourceControlOwnership, AccessControlFormData } from '../types';

export interface Props {
  values: AccessControlFormData;
  onChange(values: AccessControlFormData): void;
  hideTitle?: boolean;
  formNamespace?: string;
  errors?: FormikErrors<AccessControlFormData>;
}

export function AccessControlForm({
  values,
  onChange,
  hideTitle,
  formNamespace,
  errors,
}: Props) {
  const { isAdmin } = useUser();

  const accessControlEnabled =
    values.ownership !== ResourceControlOwnership.PUBLIC;
  return (
    <>
      {!hideTitle && <FormSectionTitle>访问控制</FormSectionTitle>}

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={accessControlEnabled}
            name={withNamespace('accessControlEnabled')}
            label="启用访问控制"
            tooltip="启用后，你可以限制对该资源的访问和管理。"
            onChange={handleToggleEnable}
            dataCy="portainer-accessMgmtToggle"
          />
        </div>
      </div>

      {accessControlEnabled && (
        <EditDetails
          onChange={onChange}
          values={values}
          errors={errors}
          formNamespace={formNamespace}
        />
      )}
    </>
  );

  function withNamespace(name: string) {
    return formNamespace ? `${formNamespace}.${name}` : name;
  }

  function handleToggleEnable(accessControlEnabled: boolean) {
    let ownership = ResourceControlOwnership.PUBLIC;
    if (accessControlEnabled) {
      ownership = isAdmin
        ? ResourceControlOwnership.ADMINISTRATORS
        : ResourceControlOwnership.PRIVATE;
    }
    onChange({ ...values, ownership });
  }
}
