import { useField } from 'formik';

import { SwitchField } from '@@/form-components/SwitchField';

import { FormValues } from './FormValues';

export function AdminSwitch() {
  const [{ name, value }, , { setValue }] =
    useField<FormValues['isAdmin']>('isAdmin');
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <SwitchField
          data-cy="user-adminSwitch"
          label="管理员"
          tooltip="管理员可以访问 Portainer 设置管理，并且对所有定义的环境及其资源拥有完全控制权限。'"
          checked={value}
          onChange={(checked) => setValue(checked)}
          name={name}
          labelClass="col-sm-3 col-lg-2"
        />
      </div>
    </div>
  );
}
